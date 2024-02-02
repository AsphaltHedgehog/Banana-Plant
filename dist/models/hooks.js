"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUpdateSetting = exports.handleSaveError = void 0;
const handleSaveError = (error, data, next) => {
    const { code, name } = error;
    error.status = code === 11000 && name === "MongoServerError" ? 409 : 400;
    next();
};
exports.handleSaveError = handleSaveError;
const addUpdateSetting = function (next) {
    this.options.new = true;
    this.options.runValidators = true;
    next();
};
exports.addUpdateSetting = addUpdateSetting;
