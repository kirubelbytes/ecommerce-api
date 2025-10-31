import express, { type NextFunction, type Request, type Response } from "express";
import { prismaClient } from "../index.js";
import { createProductSchema } from "../schemas/user.js";
import { NotFoundException } from "../exceptions/NotFoundException.js";
import { ErrorCode } from "../exceptions/BaseError.js";

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    const validatedData = createProductSchema.parse(req.body)
    const product = await prismaClient.product.create({
        data: {
            ...validatedData,
            description : validatedData.description || "",
            tags: validatedData.tags.join(","),
        },
    });
    res.json(product);
};


export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productData = req.body;

    if (Array.isArray(productData.tags)) {
      productData.tags = productData.tags.join(",");
    }

    const updatedProduct = await prismaClient.product.update({
      where: { id: Number(req.params.id) },
      data: productData,
    });

    res.json(updatedProduct);
  } catch (err: any) {
    if (err.code === "P2025") {
      return next(new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND));
    }
    next(err);
  }
};

export const deleteProduct = async(req: Request, res: Response) => {

}

export const listProducts = async(req: Request, res: Response) => {

}

export const getProductById = async(req: Request, res: Response) => {

}