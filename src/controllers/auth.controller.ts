import type { Request, Response } from "express"
import { prismaClient } from "../index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/secrets.js";
import { singUpSchema } from "../schemas/user.js";

export const signUp = async(req : Request, res: Response) => {
   const validation = singUpSchema.safeParse(req.body);
   if(!validation.success) {
    return res.status(400).json({
        success : false,
        message : "Validation failed",
        error : validation.error
    })
   };
    const { name , email , password } = validation.data;

   try {

        // Check if user exist
        let userExist = await prismaClient.user.findFirst({where : {email}});
        if(userExist) {
            return res.status(400).json({ message : "User already exist"})
        };

        // hash password securely
        const hashedPassword = await bcrypt.hash(password, 10);

        // create a user using the hashed pasword 
        const user = await prismaClient.user.create({
                data : {
                    name,
                    email,
                    password : hashedPassword
                }
        });
        
        // exclude the password from response
        const { password : _, ...safeUser } = user;

        //return created user
        return res.status(201).json(safeUser);
   } catch (error : any) {
        console.error("Sign up error:", error);
        return res.status(500).json({ message : "Internal server error" })
   };
};

export const login = async(req:Request , res: Response) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({message : "Email and Password are required!"});
        };
        const user = await prismaClient.user.findUnique({where : {email}});
        if(!user) {
            return res.status(400).json({message : "Invalid Email or Password"})
        };
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(400).json({message : "Invalid Email or Password"})
        };
        const token = jwt.sign(
            {id : user.id , email : user.email},
            JWT_SECRET,
            {expiresIn : "1d"}
        );
        const { password : _, ...safeUser } = user;
        return res.status(200).json({
            message : "Login successful",
            user : safeUser,
            token
        });
    } catch (error) {
        console.error("Login error", error);
        return res.status(500).json({ message : "Internal server error"})
    }
}