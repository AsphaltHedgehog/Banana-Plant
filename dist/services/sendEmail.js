"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const brevo_1 = require("@getbrevo/brevo");
const envConfs_1 = __importDefault(require("../conf/envConfs"));
const apiInstance = new brevo_1.TransactionalEmailsApi();
if (envConfs_1.default.brevoKey !== undefined) {
    apiInstance.authentications.apiKey.apiKey = envConfs_1.default.brevoKey;
}
else {
    throw new Error('Brevo API key is undefined');
}
const sendEmail = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const email = Object.assign(Object.assign({}, data), { sender: { email: envConfs_1.default.email } });
    apiInstance.sendTransacEmail(email);
    return true;
});
exports.default = sendEmail;
// const email = {
//     subject: 'Hello',
//     sender: { email: envsConfig.email },
//     to: [{ email: 'tane4ka170@gmail.com' }],
//     htmlContent:
//         '<h1>Congratulations! You successfully sent this example campaign via theBrevo API.</h1>',
// };
// apiInstance
//     .sendTransacEmail(email)
//     .then(() => {
//         console.log('Sended mail');
//     })
//     .catch((error: any) => {
//         console.log(error);
//     });
