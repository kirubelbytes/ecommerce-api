import express, { type NextFunction, type Request, type Response } from "express";
import { prismaClient } from "../index.js";
import { createProductSchema } from "../schemas/user.js";
import { NotFoundException } from "../exceptions/NotFoundException.js";
import { ErrorCode } from "../exceptions/BaseError.js";
import { success } from "zod";

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    const validatedData = createProductSchema.parse(req.body)
      let tagsString = "";
    if (Array.isArray(validatedData.tags)) {
      tagsString = validatedData.tags.join(",");
    } else if (typeof validatedData.tags === "string") {
      tagsString = validatedData.tags;
    }
    const product = await prismaClient.product.create({
        data: {
            ...validatedData,
            description : validatedData.description || "",
            tags: tagsString,
        },
    });
    res.status(200).json({
        success: true,
        message : "Product updated successfully",
        data : product
    });
}


export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updateProductSchema = createProductSchema.partial();

    const productData = updateProductSchema.parse(req.body) as any;

    if (Array.isArray(productData.tags)) {
      productData.tags = productData.tags.join(",");
    }

    const id = Number(req.params.id)
    const updatedProduct = await prismaClient.product.update({
      where: { id },
      data: productData,
    });

    res.status(200).json({
        success: true,
        message : "Product updated successfully",
        data : updatedProduct
    });
  } catch (err: any) {
    if (err.code === "P2025") {
      return next(new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND));
    }
    next(err);
  }
}

export const deleteProduct = async(req: Request, res: Response , next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        if(Number.isNaN(id)) {
            next(new NotFoundException("Invalid product id", ErrorCode.PRODUCT_NOT_FOUND))
        }
        const deletedProduct = await prismaClient.product.delete({where: {id}});
        res.status(200).json({
            success: true,
            message : "Product deleted Successfully",
            data : deletedProduct
        })
    } catch (err) {
        next(new NotFoundException("Product not found",ErrorCode.PRODUCT_NOT_FOUND))
    }
}

export const listProducts = async(req: Request, res: Response) => {
    const totalCount = await prismaClient.product.count();
    const skip = Number(req.query.skip) || 0;
    const take = Number(req.query.take) || 5;
    const products = await prismaClient.product.findMany({
        skip,
        take,
        orderBy : {createdAt : 'asc'}
    });
    const nextSkip = skip + take < totalCount ? skip + take : null;
    const prevSkip = skip - take >= 0 ? skip - take : null;

    res.status(200).json({
        totalCount,
        skip,
        take,
        nextSkip,
        prevSkip,
        data : products
    });
}

export const getProductById = async(req: Request, res: Response) => {

}