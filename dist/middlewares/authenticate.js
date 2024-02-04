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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envConfs_1 = __importDefault(require("../conf/envConfs"));
const User_1 = __importDefault(require("../models/User"));
const helpers_1 = require("../helpers");
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorization = '' } = req.headers;
    const [bearer, token] = authorization.split(' ');
    if (bearer !== bearer) {
        next((0, helpers_1.HttpError)(401));
    }
    try {
        if (!envConfs_1.default.secretKey) {
            throw new Error('Secret key is not configured');
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, envConfs_1.default.secretKey);
        const { id } = decodedToken;
        const user = yield User_1.default.findById(id);
        if (!user || !user.token || user.token !== token) {
            return next((0, helpers_1.HttpError)(401));
        }
        req.body.user = user;
        next();
    }
    catch (error) {
        next((0, helpers_1.HttpError)(401));
    }
});
exports.default = authenticate;
