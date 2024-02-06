"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runValidateAtUpdate = exports.handleMongooseError = void 0;
const handleMongooseError = (error, data, next) => {
    const { name, code } = error;
    error.status = (name === 'MongoServerError' && code === 11000) ? 409 : 400;
    next();
};
exports.handleMongooseError = handleMongooseError;
const runValidateAtUpdate = function (next) {
    this.options.runValidators = true;
    next();
};
exports.runValidateAtUpdate = runValidateAtUpdate;
