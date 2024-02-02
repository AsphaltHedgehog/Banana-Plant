"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../helpers/index.js");
const isEmptyBody = (req, res, next) => {
    if (!Object.keys(req.body).length) {
        return next((0, index_js_1.HttpError)(400, "Body must have fields"));
    }
    next();
};
exports.default = isEmptyBody;
