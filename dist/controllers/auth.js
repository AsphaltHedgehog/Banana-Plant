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
const User_1 = __importDefault(require("../models/User"));
const helpers_1 = require("../helpers");
const bcrypt_1 = __importDefault(require("bcrypt"));
const index_1 = require("../decorators/index");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envConfs_1 = __importDefault(require("../conf/envConfs"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const user = yield User_1.default.findOne({ email });
    if (user) {
        throw (0, helpers_1.HttpError)(409, 'Email already in use');
    }
    const hashPassword = yield bcrypt_1.default.hash(password, 10);
    const newUser = yield User_1.default.create(Object.assign(Object.assign({}, req.body), { password: hashPassword }));
    res.status(201).json({
        name: newUser.name,
        email: newUser.email,
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
    const token = jsonwebtoken_1.default.sign(payload, envConfs_1.default.secretKey, { expiresIn: '30m' });
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
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.ctrl = {
    register: (0, index_1.ctrlWrapper)(register),
    login: (0, index_1.ctrlWrapper)(login),
    logout: (0, index_1.ctrlWrapper)(logout),
};
