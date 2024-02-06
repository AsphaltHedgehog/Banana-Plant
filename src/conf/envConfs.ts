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
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
} = process.env;

interface EnvsConfig {
    port?: string;
    dbHost?: string;
    baseUrl?: string;
    secretKey?: string;
    brevoKey?: string;
    email?: string;
    frontendResetLink?: string;
    cloud_name?: string;
    api_key?: string;
    api_secret?: string;
}

const envsConfig: EnvsConfig = {
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


export default envsConfig;

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});


export { cloudinary }

