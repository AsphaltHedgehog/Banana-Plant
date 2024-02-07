"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const tempDir = path_1.default.resolve("temp");
const multerTempStorage = multer_1.default.diskStorage({
    destination: tempDir,
    filename: (req, file, cb) => {
        const uniquePrefix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
        const filename = `${uniquePrefix}_${file.originalname}`;
        cb(null, filename);
    },
});
const limits = {
    fileSize: 762 * 762,
};
const upload = (0, multer_1.default)({
    storage: multerTempStorage,
    limits
});
exports.default = upload;
