import express, { type Request, type Response, type NextFunction} from "express"
import { prismaClient } from "../index.js"
import { NotFoundException } from "../exceptions/NotFoundException.js"
import { ErrorCode } from "../exceptions/BaseError.js"


export const createOrder = async(req : Request, res: Response, next: NewableFunction) => {
    const order =  await prismaClient.$transaction(async(tx) => {
        const userId = req.user?.id
        if(!userId) {
            return next(new NotFoundException("User not found", ErrorCode.UNAUTHORIZED))
        }
        const cartItem = await tx.cartItem.findMany({
            where : { userId },
            include : { product : true}
        })
        if(cartItem.length === 0) {
            return res.json({message : "The cart is empty"})
        }
        const price = cartItem.reduce((prev, current) => {
            return prev + (current.quantity * +current.product.price)
        }, 0)
        const shippingAddressId = req.user?.defaultShippingAddress;
        if(!shippingAddressId) {
            return next(new NotFoundException('Address Id not found', ErrorCode.ADDRESS_NOT_FOUND))
        }
        const address = await tx.address.findFirst({
            where : {id : shippingAddressId}
        });
        const formattedAddress = address?.formattedAddress;
        if(!formattedAddress) {
            return next(new NotFoundException("Address not found", ErrorCode.ADDRESS_NOT_FOUND))
        }
        const order = await tx.order.create({
            data : {
                userId,
                netAmount : price,
                address : formattedAddress,
                products : {
                    create :  cartItem.map((cart) => {
                        return {
                            productId : cart.productId,
                            quantity : cart.quantity
                        }
                    })
                }
            }
        })
        const orderEvent = await tx.orderEvent.create({
           data :  {orderId : order.id}
        });
        await tx.cartItem.deleteMany({
            where : {userId}
        })
        return order
    })
     res.status(201).json({
        message : "Order created successfully",
        data : order
    })
}

export const listOrder = async( req: Request, res: Response , next : NextFunction) => {
    const userId = req.user?.id;
    if(!userId) {
        return next(new NotFoundException("User not found", ErrorCode.UNAUTHORIZED))
    }
    const orders = await prismaClient.order.findMany({
        where : {userId}
    })
    res.json(orders)
}

export const cancelOrder = async(req: Request, res:Response, next: NextFunction) => {

}

export const getOrderById = async(req: Request, res:Response, next: NextFunction) => {

}