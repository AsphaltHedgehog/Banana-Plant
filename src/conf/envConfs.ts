import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();
const {
    DB_HOST,
    PORT,
    BASE_URL,
    SECRET_KEY,
    BREVO_KEY,
    EMAIL,
    FRONTEND_RESET_LINK,
} = process.env;

interface EnvsConfig {
    port?: string;
    dbHost?: string;
    baseUrl?: string;
    secretKey?: string;
    brevoKey?: string;
    email?: string;
    frontendResetLink?: string;
}

const envsConfig: EnvsConfig = {
    port: PORT,
    dbHost: DB_HOST,
    baseUrl: BASE_URL,
    secretKey: SECRET_KEY,
    brevoKey: BREVO_KEY,
    email: EMAIL,
    frontendResetLink: FRONTEND_RESET_LINK,
};


export default envsConfig;

const cloudinaryUrlParts = process.env.CLOUDINARY_URL?.split('@');

if (!cloudinaryUrlParts) {
    throw new Error('Cloudinary URL not setup')
} 

const cloudName = cloudinaryUrlParts[1]
const [_, slashApiKey, apiSecret] = cloudinaryUrlParts[0].split(':');

const apiKey = slashApiKey.replace(/\//g, '');

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
});


export { cloudinary }

