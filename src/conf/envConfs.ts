import dotenv from 'dotenv';

dotenv.config();
const { DB_HOST, PORT, BASE_URL, SECRET_KEY } = process.env;

interface EnvsConfig {
    port?: string;
    dbHost?: string;
    baseUrl?: string;
    secretKey?: string;
}

const envsConfig: EnvsConfig = {
    port: PORT,
    dbHost: DB_HOST,
    baseUrl: BASE_URL,
    secretKey: SECRET_KEY,
};

export default envsConfig;
