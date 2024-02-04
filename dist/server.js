"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const envConfs_1 = __importDefault(require("./conf/envConfs"));
mongoose_1.default.set('strictQuery', true);
if (!envConfs_1.default.dbHost) {
    console.error('АЛО!!! ГДЕ dbHost в envConfs!!!!');
    process.exit(1);
}
mongoose_1.default
    .connect(envConfs_1.default.dbHost, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
    app_1.default.listen(envConfs_1.default.port, () => {
        console.log(`Server running. Use our API on port: ${envConfs_1.default.port}`);
    });
})
    .catch(error => {
    console.log(error.message);
    process.exit(1);
});
