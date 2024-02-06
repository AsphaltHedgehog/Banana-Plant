import jwt, { JwtPayload } from 'jsonwebtoken';
import envsConfig from '../conf/envConfs';
import User from '../models/User';
import { HttpError } from '../helpers';
import { Request, Response, NextFunction } from 'express';

const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { authorization = '' } = req.headers;
    const [bearer, token] = authorization.split(' ');
    if (bearer !== bearer) {
        next(HttpError(401));
    }
    try {
        if (!envsConfig.secretKey) {
            throw new Error('Secret key is not configured');
        }

        const decodedToken = jwt.verify(
            token,
            envsConfig.secretKey
        ) as JwtPayload;
        
        const { id } = decodedToken;

        const user = await User.findById(id);

        if (!user || !user.token || user.token !== token) {
            return next(HttpError(401));
        }

        req.body.user = user;

        next();
    } catch (error) {
        next(HttpError(401));
    }
};

export default authenticate;
