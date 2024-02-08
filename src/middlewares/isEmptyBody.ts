import { HttpError } from "../helpers/index.js";
import { Request, Response, NextFunction } from "express";

const isEmptyBody = (req:Request, res:Response, next:NextFunction) => {
    if(!Object.keys(req.body).length) {
        return next(HttpError(400, "Body must have fields"));
    }
    
    next();
}

export default isEmptyBody;