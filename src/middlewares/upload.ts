import { Request } from 'express';
import multer from "multer";
import path from "path";

const tempDir = path.resolve("temp");

const multerTempStorage = multer.diskStorage({
  destination: tempDir,
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniquePrefix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniquePrefix}_${file.originalname}`;
    cb(null, filename);
  },
});

const limits = {
  fileSize: 5000 * 5000,
};

const upload = multer({
  storage: multerTempStorage,
  limits
});

export default upload;
