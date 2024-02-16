"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@((([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})|(\[IPv6:[^\]]+\]))$/i;
const passedQuizSchema = new mongoose_1.Schema({
    quizId: {
        type: String,
    },
    quantityQuestions: {
        type: Number,
    },
    correctAnswers: {
        type: Number,
    },
});
const userSchema = new mongoose_1.Schema({
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'quizes',
            default: [],
        },
    ],
    passedQuizzes: {
        type: [passedQuizSchema],
    },
    totalQuestions: {
        type: Number,
        default: 0
    },
    totalAnswers: {
        type: Number,
        default: 0
    },
    average: {
        type: Number,
        default: 0
    },
}, { versionKey: false, timestamps: true });
const User = (0, mongoose_1.model)('user', userSchema);
exports.default = User;
