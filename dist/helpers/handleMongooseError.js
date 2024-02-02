"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleMongooseError = (error, data, next) => {
    const { name, code } = error;
    const status = name === "MongoServerError" && code === 11000 ? 409 : 400;
    error.status = status;
    next();
};
exports.default = handleMongooseError;
