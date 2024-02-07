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
// const cloudinaryUrlParts = process.env.CLOUDINARY_URL?.split('@');
// if (cloudinaryUrlParts) {
//     const [credentialsPart, cloudNamePart] = cloudinaryUrlParts[0].split(':');
//     const [apiKey, apiSecret] = credentialsPart.split(':');
//     console.log(apiKey, apiSecret);
//     const cloudName = cloudNamePart.replace('cloudinary://', '');
//     cloudinary.config({
//         cloud_name: cloudName,
//         api_key: apiKey,
//         api_secret: apiSecret
//     });
// } else {
//     console.error('CLOUDINARY_URL is not defined');
// }
cloudinary_1.v2.config({
    cloud_name: 'dddrrdx7a',
    api_key: '218738411157477',
    api_secret: 'UW4Sxhg0KjSrdBIa-IpuiMUrYKs'
});
