"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { DB_HOST, PORT, BASE_URL } = process.env;
const envsConfig = {
    port: PORT,
    dbHost: DB_HOST,
    baseUrl: BASE_URL,
};
exports.default = envsConfig;