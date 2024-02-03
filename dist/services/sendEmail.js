"use strict";
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
const email = {
    subject: 'Hello',
    sender: { email: envConfs_1.default.email },
    to: [{ email: 'tane4ka170@gmail.com' }],
    htmlContent: '<h1>Congratulations! You successfully sent this example campaign via theBrevo API.</h1>',
};
apiInstance
    .sendTransacEmail(email)
    .then(() => {
    console.log('Sended mail');
})
    .catch((error) => {
    console.log(error);
});
