import { Error, Document } from 'mongoose';

interface CustomError extends Error {
  status?: number;
  code?: number;
}

export const handleMongooseError = (error: CustomError, data: Document, next: () => void): void => {
  const { name, code } = error;
  error.status = (name === 'MongoServerError' && code === 11000) ? 409 : 400;
  next();
};

export const runValidateAtUpdate = function (this: any, next: () => void): void {
  this.options.runValidators = true;
  next();
};
