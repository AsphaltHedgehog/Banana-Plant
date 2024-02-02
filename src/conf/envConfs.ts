import dotenv from "dotenv"

dotenv.config();
const { DB_HOST, PORT, BASE_URL } = process.env;

const envsConfig = {
  port: PORT,
  dbHost: DB_HOST,
  baseUrl: BASE_URL,
};

export default envsConfig;