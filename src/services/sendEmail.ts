import brevo, { TransactionalEmailsApi } from '@getbrevo/brevo';
import envsConfig from '../conf/envConfs';

export interface EmailData {
    subject: string;
    sender?: { email: string };
    to: { email: string }[];
    htmlContent: string;
}
const apiInstance = new TransactionalEmailsApi() as any;
if (envsConfig.brevoKey !== undefined) {
    apiInstance.authentications.apiKey.apiKey = envsConfig.brevoKey;
} else {
    throw new Error('Brevo API key is undefined');
}

const sendEmail = async (data: EmailData) => {
    const email = { ...data, sender: { email: envsConfig.email } };
    apiInstance.sendTransacEmail(email);
    return true;
};

export default sendEmail;
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
