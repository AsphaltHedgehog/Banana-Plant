import { Request, Express } from 'express';
import multer, { MulterError } from "multer";
import path from "path";

// import { HttpError } from "../helpers/index.js";
// import { CustomError } from '../helpers/HttpError.js';

const tempDir = path.resolve("/");

const multerTempStorage = multer.diskStorage({
  destination: tempDir,
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void ) => {
    const uniquePrefix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniquePrefix}_${file.originalname}`;
    cb(null, filename);
  },
});

const limits = {
  fileSize: 1024 * 1024 * 5,
};

const fileFilter = (req: Request, file: Express.Multer.File, cb: (error: MulterError | null, acceptFile: boolean) => void ) => {
  const extention = file.originalname.split(".").pop();
  if (extention === "exe") {
  const error: MulterError = new multer.MulterError('LIMIT_UNEXPECTED_FILE');
  cb(error, false);
  }
  cb(null, true);
};

const upload = multer({
  multerTempStorage,
  limits,
  fileFilter,
});

export default upload;
