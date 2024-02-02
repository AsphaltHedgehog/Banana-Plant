import { Error as MongooseError } from "mongoose";
import { NextFunction } from "express";

const handleMongooseError = (
  error: MongooseError & { code?: number, status?: number },
  data: any,
  next: NextFunction
): void => {
  const { name, code } = error;
  const status = name === "MongoServerError" && code === 11000 ? 409 : 400;
  error.status = status;
  next();
};

export default handleMongooseError;
