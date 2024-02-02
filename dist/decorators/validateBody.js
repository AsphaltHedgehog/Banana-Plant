"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../helpers/index.js");
const validateBody = (schema) => {
    const func = (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return next((0, index_js_1.HttpError)(400, error.message));
        }
        next();
    };
    return func;
};
exports.default = validateBody;
