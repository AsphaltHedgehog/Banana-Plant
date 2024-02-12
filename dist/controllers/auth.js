"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ctrl = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const gravatar_1 = __importDefault(require("gravatar"));
const envConfs_1 = __importDefault(require("../conf/envConfs"));
const helpers_1 = require("../helpers");
const index_1 = require("../decorators/index");
const User_1 = __importDefault(require("../models/User"));
const sendEmail_1 = __importDefault(require("../services/sendEmail"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const user = yield User_1.default.findOne({ email });
    const avatarURL = gravatar_1.default.url(email);
    if (user) {
        throw (0, helpers_1.HttpError)(409, 'Email already in use');
    }
    const hashPassword = yield bcrypt_1.default.hash(password, 10);
    const newUser = yield User_1.default.create(Object.assign(Object.assign({}, req.body), { password: hashPassword, avatarURL: avatarURL }));
    res.status(201).json({
        name: newUser.name,
        email: newUser.email,
        avatarUrl: newUser.avatarUrl
    });
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield User_1.default.findOne({ email });
    if (!user) {
        throw (0, helpers_1.HttpError)(401, 'Incorrect email or password');
    }
    const passwordCompare = yield bcrypt_1.default.compare(password, user.password);
    if (!passwordCompare) {
        throw (0, helpers_1.HttpError)(401, 'Incorrect email or password');
    }
    if (!envConfs_1.default.secretKey) {
        throw new Error('Secret key is not configured');
    }
    const payload = {
        id: user._id,
    };
    const token = jsonwebtoken_1.default.sign(payload, envConfs_1.default.secretKey, { expiresIn: '23h' });
    yield User_1.default.findByIdAndUpdate(user._id, { token });
    res.json({ token });
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.body.user;
    const user = yield User_1.default.findByIdAndUpdate(_id, { token: '' });
    if (!user) {
        throw (0, helpers_1.HttpError)(401, 'Unauthorized');
    }
    res.status(204).json({});
});
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield User_1.default.findOne({ email });
    if (!user) {
        throw (0, helpers_1.HttpError)(404, 'Account not found');
    }
    const resetToken = crypto_1.default.randomUUID();
    const expires = Date.now() + 1000 * 60 * 60;
    yield User_1.default.findByIdAndUpdate(user._id, {
        $set: { resetToken, resetTokenExpires: expires },
    });
    const emailData = {
        subject: 'Password reset',
        to: [{ email }],
        htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Password Reset</h2>
            <p>Dear User,</p>
            <p>We have received a notification that your current password may be compromised or unsafe. To ensure the security of your account, we recommend you reset your password.</p>
            <p>Please use the <a href="${envConfs_1.default.frontendResetLink}/${resetToken}" style="color: #007BFF; text-decoration: none;">following link</a> to set a new password.</p>
            <p>If you did not initiate this request, please ignore this message.</p>
            <p>Thank you for your understanding and prompt action.</p>
            <p>Best regards,<br>Your Support Team</p>
        </div>
    `,
    };
    yield (0, sendEmail_1.default)(emailData);
    res.status(200).json({ message: 'Message delivered' });
});
const newPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { resetToken } = req.params;
    const { newPassword } = req.body;
    const user = yield User_1.default.findOne({ resetToken: resetToken });
    if (!user) {
        throw (0, helpers_1.HttpError)(401, 'Invalid or expired token');
    }
    if (!newPassword) {
        throw (0, helpers_1.HttpError)(400, 'New password is required');
    }
    const hashPassword = yield bcrypt_1.default.hash(newPassword, 10);
    user.password = hashPassword;
    user.resetToken = null;
    yield user.save();
    res.status(201).json({ message: 'Password reset successful' });
});
exports.ctrl = {
    register: (0, index_1.ctrlWrapper)(register),
    login: (0, index_1.ctrlWrapper)(login),
    logout: (0, index_1.ctrlWrapper)(logout),
    resetPassword: (0, index_1.ctrlWrapper)(resetPassword),
    newPassword: (0, index_1.ctrlWrapper)(newPassword),
};
