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
    passedQuizzes: passedQuizSchema[];
    average: number; 
}

export interface passedQuizSchema extends Document{
    quizId: string;
    quantityQuestions: number;
    correctAnswers: number;
    rating: number;
}

const emailRegex =
/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@((([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})|(\[IPv6:[^\]]+\]))$/i;

const passedQuizSchema = new Schema<passedQuizSchema>({
  quizId: {
    type: String,
  },
  quantityQuestions: {
    type: Number,
  },
  correctAnswers: {
    type: Number,
    },
    rating: {
      type: Number,
  }
});

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
             minlength: 8,
            maxlength: 64,
        },
        password: {
            type: String,
            required: [true, "Set user's password"],
            minlength: 8,
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
        passedQuizzes: [{
            type: passedQuizSchema,
            default: []
        }],
        average: {
            type: Number,
            default: 0
        },
        
    },
    { versionKey: false, timestamps: true }
);


const User: Model<User> = model<User>('user', userSchema);

export default User;
