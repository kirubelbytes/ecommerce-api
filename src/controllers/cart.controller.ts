import express, { type Request, type Response ,type NextFunction} from "express"
import { createCartSchema } from "../schemas/cart.js"
import type { Product } from "@prisma/client";
import { NotFoundException } from "../exceptions/NotFoundException.js";
import { ErrorCode } from "../exceptions/BaseError.js";
import { prismaClient } from "../index.js";

export const addItemToCart = async(req : Request , res: Response , next : NextFunction) => {
    const validatedData = createCartSchema.parse(req.body);
    let product : Product;
    try {
        product = await prismaClient.product.findFirstOrThrow({
            where : {id : validatedData.productId}
        });
        if(!req.user?.id) {
           return next(new NotFoundException("User not found", ErrorCode.UNAUTHORIZED))
        }
        const cart = await prismaClient.cartItem.create({
            data : {
                userId :  req.user?.id,
                productId : product.id,
                quantity : validatedData.quantity
            }
        });
        res.status(200).json({
            message : "Product added to the cart successfuly",
            data : cart
        })
    } catch (error) {
        next(new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND))
    }
   
}

export const deleteItemFromCart = async(req: Request, res: Response, next: NextFunction) => {

}

export const changeQuantity = async(req: Request, res: Response, next: NextFunction) => {

}

export const getCart = async(req: Request, res: Response, next: NextFunction) => {

}