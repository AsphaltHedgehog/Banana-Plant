import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import envsConfig from '../conf/envConfs';

import { HttpError } from '../helpers';
import { ctrlWrapper } from '../decorators/index';

import User from '../models/User';
import sendEmail, { EmailData } from '../services/sendEmail';

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
const resetPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(404, 'Account not found');
    }
    const resetToken = crypto.randomUUID();
    await User.findOneAndUpdate({ email }, { $set: { resetToken } });
    const emailData: EmailData = {
        subject: 'Password reset',
        to: [{ email }],
        htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Password Reset</h2>
            <p>Dear User,</p>
            <p>We have received a notification that your current password may be compromised or unsafe. To ensure the security of your account, we recommend you reset your password.</p>
            <p>Please use the <a href="${envsConfig.frontendResetLink}?token=${resetToken}" style="color: #007BFF; text-decoration: none;">following link</a> to set a new password.</p>
            <p>If you did not initiate this request, please ignore this message.</p>
            <p>Thank you for your understanding and prompt action.</p>
            <p>Best regards,<br>Your Support Team</p>
        </div>
    `,
    };
    await sendEmail(emailData);
    res.json({ message: 'Message delivered' });
};

const newPassword = async (req: Request, res: Response) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({ resetToken: token });

    if (!user) {
        throw HttpError(401, 'Invalid or expired token');
    }

    // Перевірте, чи є newPassword та не є порожнім значенням
    if (!newPassword) {
        throw HttpError(400, 'New password is required');
    }

    // Хешуємо новий пароль і зберігаємо його
    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    user.resetToken = null;

    await user.save();

    res.json({ message: 'Password reset successful' });
};

export const ctrl = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
    resetPassword: ctrlWrapper(resetPassword),
    newPassword: ctrlWrapper(newPassword),
};
