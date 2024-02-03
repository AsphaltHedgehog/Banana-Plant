import dotenv from 'dotenv';

dotenv.config();
const { DB_HOST, PORT, BASE_URL, SECRET_KEY, BREVO_KEY, EMAIL } = process.env;

interface EnvsConfig {
    port?: string;
    dbHost?: string;
    baseUrl?: string;
    secretKey?: string;
    brevoKey?: string;
    email?: string;
}

const envsConfig: EnvsConfig = {
    port: PORT,
    dbHost: DB_HOST,
    baseUrl: BASE_URL,
    secretKey: SECRET_KEY,
    brevoKey: BREVO_KEY,
    email: EMAIL,
};

export default envsConfig;
