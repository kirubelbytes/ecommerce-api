import { ErrorCode, HttpException } from "./BaseError.js";
export class BadRequestException extends HttpException {
    constructor(message : string, errorCode : ErrorCode) {
        super(message, errorCode , 400, null)
    }
}