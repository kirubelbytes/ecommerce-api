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

}

export const listAddress = (req: Request, res: Response) => {

}

