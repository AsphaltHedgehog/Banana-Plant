import dotenv from 'dotenv';

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
