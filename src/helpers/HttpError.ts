interface ErrorMessageList {
    [key: number]: string
};

export class CustomError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

const errorMessageList: ErrorMessageList = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    409: "Conflict",
    11000: "Email is already in use"
}

const HttpError = (status: number, message: string = errorMessageList[status]) => {
    const error = new CustomError(message, status);
    error.status = status;
    return error;
}

export default HttpError;