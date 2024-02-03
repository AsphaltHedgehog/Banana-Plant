import { Document, Model, Schema, model } from 'mongoose';
import { handleMongooseError } from '../helpers';

export interface User extends Document {
    name: string;
    email: string;
    password: string;
    token: string;
    contactInfo: {
        additionalEmail: string;
    };
    favoriteTests: Schema.Types.ObjectId[];
    updateContactInfo: (newContactInfo: any) => Promise<void>;
    addFavoriteTest: (testId: Schema.Types.ObjectId) => Promise<void>;
    removeFavoriteTest: (testId: Schema.Types.ObjectId) => Promise<void>;
}


const emailRegex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@((([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})|(\[IPv6:[^\]]+\]))$/i;

const userSchema = new Schema<User>(
    {
        name: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 32,
        },
        email: {
            type: String,
            match: emailRegex,
            required: [true, 'An email is necessary'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Set user's password"],
            minlength: 1,
            maxlength: 64,
        },
        token: {
            type: String,
            default: '',
            
        },
       
        favoriteTests: [{
            type: Schema.Types.ObjectId,
            ref: 'Test',
           
            default: []
        }],
    },
    { versionKey: false, timestamps: true }
);
// Методи оновлює  додає  видаляє
// userSchema.methods.updateContactInfo = function (newContactInfo) {
//     this.contactInfo.additionalEmail = newContactInfo.additionalEmail || this.contactInfo.additionalEmail;
//     return this.save();
// };
// userSchema.methods.addFavoriteTest = function (testId) {
//     if (!this.favoriteTests.includes(testId)) {
//         this.favoriteTests.push(testId);
//         return this.save();
//     }
// };
// userSchema.methods.removeFavoriteTest = function (testId) {
//     const index = this.favoriteTests.indexOf(testId);
//     if (index !== -1) {
//         this.favoriteTests.splice(index, 1);
//         return this.save();
//     }
// };
// userSchema.post("save", handleMongooseError);

const User: Model<User> = model<User>('user', userSchema);


export default User;
