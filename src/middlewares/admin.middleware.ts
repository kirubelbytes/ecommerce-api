import type { Request, Response, NextFunction } from "express";
import { UnauthorizedException } from "../exceptions/UnauthorizedException.js";
import { ErrorCode } from "../exceptions/BaseError.js";

const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (!user) {
    return next(new UnauthorizedException("Unauthenticated", ErrorCode.UNAUTHORIZED));
  }

  if (user.role === "ADMIN") {
    return next();
  } else {
    return next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }
};

export default adminMiddleware;
