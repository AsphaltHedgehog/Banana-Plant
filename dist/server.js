"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_js_1 = __importDefault(require("./app.js"));
require("dotenv/config");
const conf_1 = require("./conf");
mongoose_1.default.set('strictQuery', true);
if (!conf_1.envConfs.dbHost) {
    console.error("АЛО!!! ГДЕ dbHost в envConfs!!!!");
    process.exit(1);
}
mongoose_1.default
    .connect(conf_1.envConfs.dbHost)
    .then(() => {
    app_js_1.default.listen(conf_1.envConfs.port, () => {
        console.log(`Server running. Use our API on port: ${conf_1.envConfs.port}`);
    });
})
    .catch((error) => {
    console.log(error.message);
    process.exit(1);
});
