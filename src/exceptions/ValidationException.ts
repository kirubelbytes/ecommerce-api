import { HttpException, ErrorCode } from "./BaseError.js";
import type { ZodError, ZodIssue } from "zod"; // type-only import

export class UnprocessableEntity extends HttpException {
  constructor(
    error: ZodError<unknown>,
    message: string = "Validation failed",
    errorCode: number = ErrorCode.UNPROCESSABLE_ENTITY 
  ) {
    const formattedErrors: { path: string; message: string }[] = error.issues.map((issue: ZodIssue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));

    super(message, errorCode, 422, formattedErrors);
  }
}
