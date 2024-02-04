"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const index_js_1 = require("../helpers/index.js");
const destination = path_1.default.resolve("temp");
const storage = multer_1.default.diskStorage({
    destination,
    filename: (req, file, cb) => {
        const uniquePrefix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
        const filename = `${uniquePrefix}_${file.originalname}`;
        cb(null, filename);
    },
});
const limits = {
    fileSize: 1024 * 1024 * 5,
};
const fileFilter = (req, file, cb) => {
    const extention = file.originalname.split(".").pop();
    if (extention === "exe") {
        cb((0, index_js_1.HttpError)(400, "Cannot save file with .exe extention"));
    }
    cb(null, true);
};
const upload = (0, multer_1.default)({
    storage,
    limits,
    fileFilter,
});
exports.default = upload;
