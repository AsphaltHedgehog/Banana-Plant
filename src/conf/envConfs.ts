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

    cloudinary.config({
        cloud_name: 'dddrrdx7a',
        api_key: '218738411157477',
        api_secret: 'UW4Sxhg0KjSrdBIa-IpuiMUrYKs'
    });


export { cloudinary }

