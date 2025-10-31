import express, { type NextFunction, type Request, type Response } from "express";
import { prismaClient } from "../index.js";
import { createProductSchema } from "../schemas/user.js";

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
