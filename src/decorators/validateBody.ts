import Joi, { Schema } from "joi";
import { HttpError } from "../helpers/index.js";
import { Request, Response, NextFunction } from "express";

const validateBody = <T> (schema: Schema<T>) => {
    const func = (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return next(HttpError(400, error.message));
        }
        next();
    }

    return func;
}

export default validateBody;