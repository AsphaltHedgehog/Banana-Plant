import { Document, Model, Schema, model } from 'mongoose';

export interface User extends Document {
    name: string;
    email: string;
    password: string;
    avatarURL: string;
    token: string;
    resetToken: string | null;
    contactInfo: {
        additionalEmail: string;
    };
    favorite: Schema.Types.ObjectId[];

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
        avatarURL: {
            type: String,
            required: true,
        },
        token: {
            type: String,
            default: '',
        },
        resetToken: {
            type: String,
            default: null,
        },

        favorite: [
            {
                type: Schema.Types.ObjectId,
                ref: 'quizes',

                default: [],
            },
        ],
    },
    { versionKey: false, timestamps: true }
);

const User: Model<User> = model<User>('user', userSchema);

export default User;
