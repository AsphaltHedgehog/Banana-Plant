"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
dotenv_1.default.config();
const { DB_HOST, PORT, BASE_URL, SECRET_KEY, BREVO_KEY, EMAIL, FRONTEND_RESET_LINK, } = process.env;
const envsConfig = {
    port: PORT,
    dbHost: DB_HOST,
    baseUrl: BASE_URL,
    secretKey: SECRET_KEY,
    brevoKey: BREVO_KEY,
    email: EMAIL,
    frontendResetLink: FRONTEND_RESET_LINK,
};
exports.default = envsConfig;
const cloudinaryUrlParts = (_a = process.env.CLOUDINARY_URL) === null || _a === void 0 ? void 0 : _a.split('@');
if (!cloudinaryUrlParts) {
    throw new Error('Cloudinary URL not setup');
}
const cloudName = cloudinaryUrlParts[1];
const [_, slashApiKey, apiSecret] = cloudinaryUrlParts[0].split(':');
const apiKey = slashApiKey.replace(/\//g, '');
cloudinary_1.v2.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
});
