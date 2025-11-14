import express, {type NextFunction, type Request, type Response} from 'express'
import { addressSchema, updateUserSchema } from '../schemas/user.js'
import { NotFoundException } from '../exceptions/NotFoundException.js'
import { ErrorCode } from '../exceptions/BaseError.js'
import type { Address, User } from '@prisma/client'
import { prismaClient } from '../index.js'
import { BadRequestException } from '../exceptions/BadRequest.js'

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

export const updateAddress = async(req: Request , res: Response, next: NextFunction) => {
    const validatedData = updateUserSchema.parse(req.body);
    let shippingAddress: Address;
    let billingAddress: Address;
    if(validatedData.defaultShippingAddress) {
        try {
            const shippingId = Number(validatedData.defaultShippingAddress); 
            shippingAddress = await prismaClient.address.findFirstOrThrow({
            where: {id : shippingId}
            });
            if(shippingAddress.userId !== req.user?.id ) {
                next(new BadRequestException("Address doesn't belong to user", ErrorCode.ADDRESS_DOES_NOT_BELONG))
            }
        } catch (error) {
            next(new NotFoundException("Address not found", ErrorCode.ADDRESS_NOT_FOUND))
        }
    };
    if(validatedData.defaultBillingAddress) {
        try {
            const billingId = Number(validatedData.defaultBillingAddress);
            billingAddress = await prismaClient.address.findFirstOrThrow({
                where : {id : billingId}
            })
            if(billingAddress.userId !== req.user?.id) {
                next(new BadRequestException("Address doesn't belong to ", ErrorCode.ADDRESS_DOES_NOT_BELONG))
            }
        } catch (error) {
            next(new NotFoundException("Address not found", ErrorCode.ADDRESS_NOT_FOUND))
        }
    }
    const userId = Number(req.user?.id)
    const allowedData = Object.fromEntries(
      Object.entries(validatedData).filter(([_, value]) => value !== undefined)
    );

    const updatedUser = await prismaClient.user.update({
        where: {id : userId},
        data : allowedData
    })
    res.status(200).json({
        success: true,
        data : updatedUser
    })
};


export const listUser = async(req: Request, res: Response, next: NextFunction) => {
   const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 5, 100); 
    if (page <= 0 || limit <= 0) return next(new BadRequestException("Invalid pagination", ErrorCode.UNPROCESSABLE_ENTITY));
    const skip = (page - 1) * limit;
    const [users, total] = await prismaClient.$transaction([
    prismaClient.user.findMany({ skip, take: limit }),
    prismaClient.user.count()
    ]);
    return res.status(200).json({
    data: users,
    meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
    }
    });
}

export const getUserById = async(req: Request, res:Response , next: NextFunction ) => {
   
}

export const changeUserRole = async(req : Request, res: Response, next: NextFunction) => {
  
}