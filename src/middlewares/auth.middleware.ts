import { type Request, type Response, type NextFunction } from "express";
import { UnauthorizedException } from "../exceptions/UnauthorizedException.js";
import { ErrorCode } from "../exceptions/BaseError.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config/secrets.js";
import { prismaClient } from "../index.js";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction ) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === "string" || !decoded) {
      return next(new UnauthorizedException("Invalid token", ErrorCode.UNAUTHORIZED));
    }

    const payload = decoded as JwtPayload & { id: number; email: string };
    const user = await prismaClient.user.findFirst({ where: { id: payload.id } });

    if (!user) {
      return next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
    }

    req.user = user;
    next();
  } catch (error) {
    next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }
};
