import type { NextFunction, Request, Response } from "express"
import { prismaClient } from "../index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/secrets.js";
import { logInSchema, singUpSchema } from "../schemas/user.js";
import { BadRequestException } from "../exceptions/BadRequest.js";
import { ErrorCode } from "../exceptions/BaseError.js";
import { UnauthorizedException } from "../exceptions/UnauthorizedException.js";

export const signUp = async(req : Request, res: Response, next : NextFunction) => {
   const validation = singUpSchema.safeParse(req.body);
   if(!validation.success) { 
    return res.status(400).json({
        success : false,
        message : "Validation failed",
        error : validation.error
    })
   };
    const { name , email , password } = validation.data;

    // Check if user exist
    let userExist = await prismaClient.user.findFirst({where : {email}});
    if(userExist) {
       return next(new BadRequestException("User Not Found", ErrorCode.USER_ALREADY_EXISTS));
    }

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
};

export const login = async(req:Request , res: Response, next : NextFunction) => {
    const parsed = logInSchema.safeParse(req.body);
    if (!parsed.success) {
    return res.status(400).json({
        success: false,
        message: "Invalid input data",
    });
    }

    const { email, password } = parsed.data;

    const user = await prismaClient.user.findUnique({where : {email}});
    if(!user) {
        return next(new UnauthorizedException("Invalid Email or Password", ErrorCode.USER_NOT_FOUND ))
    };
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
       return next(new UnauthorizedException("Invalid Email or Password", ErrorCode.USER_NOT_FOUND))
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
}