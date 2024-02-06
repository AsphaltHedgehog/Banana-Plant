"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// import { HttpError } from "../helpers/index.js";
// import { CustomError } from '../helpers/HttpError.js';
const tempDir = path_1.default.resolve("/");
const multerTempStorage = multer_1.default.diskStorage({
    destination: tempDir,
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
        const error = new multer_1.default.MulterError('LIMIT_UNEXPECTED_FILE');
        cb(error, false);
    }
    cb(null, true);
};
const upload = (0, multer_1.default)({
    multerTempStorage,
    limits,
    fileFilter,
});
exports.default = upload;
