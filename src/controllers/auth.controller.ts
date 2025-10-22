import type { Request, Response } from "express"
import { prismaClient } from "../index.js";
import bcrypt from "bcrypt";
export const signUp = async(req : Request, res: Response) => {
   const { name , email , password } = req.body;
   try {
        // validate input 
        if(!email || !password || !name) {
            return res.status(400).json({message : "All fields are required"})
        }

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

}