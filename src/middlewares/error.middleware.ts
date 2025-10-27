import type { Request, Response, NextFunction } from "express";
import type { HttpException } from "../exceptions/BaseError.js";

export const errorMiddleware = (error : HttpException, req : Request , res : Response, next : NextFunction) => {
    res.status(error.statusCode).json({
        message : error.message,
        errorCode : error.errorCode,
        errors : error.errors
    })
};