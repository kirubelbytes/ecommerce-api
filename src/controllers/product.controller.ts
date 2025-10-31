import express, { type Request, type Response } from "express";
import { prismaClient } from "../index.js";

export const createProduct = async (req: Request, res: Response) => {
    const product = await prismaClient.product.create({
      data: {
        ...req.body,
        tags:req.body.tags.join(",")
      },
    });

    res.json(product);
};
