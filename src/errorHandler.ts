import type { NextFunction, Request, Response } from "express";
import { ErrorCode, HttpException } from "./exceptions/BaseError.js";
import { InternalException } from "./exceptions/InternalException.js";

export const errorHandler = (method: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(method(req, res, next)).catch((error) => {
      let exception;
      if (error instanceof HttpException) {
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
