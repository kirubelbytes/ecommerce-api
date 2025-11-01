import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ErrorCode, HttpException } from "./exceptions/BaseError.js";
import { InternalException } from "./exceptions/InternalException.js";

export const errorHandler = (method: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(method(req, res, next)).catch((error) => {
      let exception;

      if (error instanceof ZodError) {
        exception = new HttpException(
          "Validation failed!",
          ErrorCode.VALIDATION_ERROR || 1001,
          400,
          error.issues
        );
      } else if (error instanceof HttpException) {
        exception = error;
      } else {
        exception = new InternalException(
          "Something went wrong!",
          error,
          ErrorCode.INTERNAL_EXCEPTION
        );
      }

      next(exception);
    });
  };
};
