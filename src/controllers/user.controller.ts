import express, {type NextFunction, type Request, type Response} from 'express'
import { addressSchema } from '../schemas/user.js'
import { NotFoundException } from '../exceptions/NotFoundException.js'
import { ErrorCode } from '../exceptions/BaseError.js'
import type { User } from '@prisma/client'
import { prismaClient } from '../index.js'

export const addAddress = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = addressSchema.parse(req.body);
        const userId = Number(req.user?.id);
        const user = await prismaClient.user.findFirstOrThrow({
            where : {id : userId}
        });

        const address = await prismaClient.address.create({
            data : {
                lineOne: validatedData.lineOne,
                lineTwo: validatedData.lineTwo ?? "",
                city: validatedData.city,
                country: validatedData.country,
                pincode: validatedData.pincode,
                userId
            }
        })
        res.status(200).json(address)
    } catch (error) {
        next( new NotFoundException("User not found ", ErrorCode.USER_NOT_FOUND))
    }
}

export const deleteAddress = async(req: Request , res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        const userId = req.user?.id;
        const address = await prismaClient.address.findUnique({
            where : {id}
        });
        if(!address || !(address.userId === userId)) {
            next( new NotFoundException("Address not found or Unauthorised", ErrorCode.ADDRESS_NOT_FOUND))
        };
        await prismaClient.address.delete({
            where : {id}
        });
        res.status(200).json({
            success : true,
            message : "Address deleted Successfully"
        });
    } catch (error) {
        next(new NotFoundException("Address not found", ErrorCode.ADDRESS_NOT_FOUND))
    }
}

export const listAddress = async(req: Request, res: Response, next: NextFunction) => {
     try {
        if(!req.user?.id) {
            return next( new NotFoundException("User not found", ErrorCode.UNAUTHORIZED))
        }
        const address = await prismaClient.address.findMany({
            where : {userId : req.user?.id}
        });
        res.status(200).json(address)
     } catch (error) {
        next(error)
     }
}

