"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
;
class CustomError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}
exports.CustomError = CustomError;
const errorMessageList = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    409: "Conflict",
    11000: "Email is already in use"
};
const HttpError = (status, message = errorMessageList[status]) => {
    const error = new CustomError(message, status);
    error.status = status;
    return error;
};
exports.default = HttpError;
