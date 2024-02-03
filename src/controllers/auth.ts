import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import envsConfig from '../conf/envConfs';

import { HttpError } from '../helpers';
import { ctrlWrapper } from '../decorators/index';

import User from '../models/User';

const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        throw HttpError(409, 'Email already in use');
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        ...req.body,
        password: hashPassword,
    });

    res.status(201).json({
        name: newUser.name,
        email: newUser.email,
    });
};

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, 'Incorrect email or password');
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, 'Incorrect email or password');
    }

    if (!envsConfig.secretKey) {
        throw new Error('Secret key is not configured');
    }

    const payload = {
        id: user._id,
    };

    const token = jwt.sign(payload, envsConfig.secretKey, { expiresIn: '30m' });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({ token });
};

const logout = async (req: Request, res: Response) => {
    const { _id } = req.body.user;
    const user = await User.findByIdAndUpdate(_id, { token: '' });
    if (!user) {
        throw HttpError(401, 'Unauthorized');
    }
    res.status(204).json({});
};
const resetPassword = async (req: Request, res: Response) => {};

export const ctrl = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
};
