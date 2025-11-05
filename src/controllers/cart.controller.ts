import express, { type Request, type Response ,type NextFunction} from "express"
import { createCartSchema } from "../schemas/cart.js"
import type { CartItem, Product } from "@prisma/client";
import { NotFoundException } from "../exceptions/NotFoundException.js";
import { ErrorCode } from "../exceptions/BaseError.js";
import { prismaClient } from "../index.js";

export const addItemToCart = async(req : Request , res: Response , next : NextFunction) => {
    const validatedData = createCartSchema.parse(req.body);
    let product : Product;
    try {
        product = await prismaClient.product.findFirstOrThrow({
            where : { id : validatedData.productId }
        });

        if (!req.user?.id) {
        return next(new NotFoundException("User not found", ErrorCode.UNAUTHORIZED))
        }

        let cart = await prismaClient.cartItem.findFirst({
            where: {
                userId: req.user.id,
                productId: product.id
            }
        });

        if (cart) {
            cart = await prismaClient.cartItem.update({
                where: { id: cart.id },
                data: { quantity: cart.quantity + validatedData.quantity }
            });
        } else {
            cart = await prismaClient.cartItem.create({
                data : {
                    userId: req.user.id,
                    productId: product.id,
                    quantity: validatedData.quantity
                }
            });
        }
        res.status(200).json({
            message: "Product added to the cart successfully",
            data: cart
        });
    } catch (error) {
        next(new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND))
    }
}


export const deleteItemFromCart = async(req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if(isNaN(id) || id <= 0) {
       return next(new NotFoundException("Invalid ID", ErrorCode.PRODUCT_NOT_FOUND))
    } 
    const cartItem = await prismaClient.cartItem.findFirst({
        where : {id}
    });
    if(!cartItem) {
       return next(new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND))
    }
    if(!req.user?.id || req.user?.id !== cartItem?.userId) {
        next(new NotFoundException("User Not found", ErrorCode.UNAUTHORIZED))
    }
    await prismaClient.cartItem.delete({
        where : {id}
    })
    res.status(200).json({message : "Item deleted from cart successfully"});
}

export const changeQuantity = async(req: Request, res: Response, next: NextFunction) => {
    const validatedData =  req.body ;
    const id = Number(req.params.id);
    const userId =  req.user?.id

    if(isNaN(id) || id <= 0) {
       return next(new NotFoundException("Invalid Id", ErrorCode.UNAUTHORIZED))
    };
    const cartItem = await prismaClient.cartItem.findFirstOrThrow({
        where : {id}
    });
    if(!cartItem || cartItem.userId !== req.user?.id) {
       return next(new NotFoundException("Item not found", ErrorCode.UNAUTHORIZED))
    }
    const updatedCartItem = await prismaClient.cartItem.update({
        where : { id},
        data : {
            quantity : validatedData.quantity
        }
    }) 
    res.status(200).json(updatedCartItem)
}

export const getCart = async(req: Request, res: Response, next: NextFunction) => {

}