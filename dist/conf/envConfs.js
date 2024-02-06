"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
dotenv_1.default.config();
const { DB_HOST, PORT, BASE_URL, SECRET_KEY, BREVO_KEY, EMAIL, FRONTEND_RESET_LINK, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, } = process.env;
const envsConfig = {
    port: PORT,
    dbHost: DB_HOST,
    baseUrl: BASE_URL,
    secretKey: SECRET_KEY,
    brevoKey: BREVO_KEY,
    email: EMAIL,
    frontendResetLink: FRONTEND_RESET_LINK,
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
};
exports.default = envsConfig;
cloudinary_1.v2.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});
