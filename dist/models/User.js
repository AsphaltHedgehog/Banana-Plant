"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@((([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})|(\[IPv6:[^\]]+\]))$/i;
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
}, { versionKey: false, timestamps: true });
// userSchema.post("save", handleMongooseError);
const User = (0, mongoose_1.model)('user', userSchema);
exports.default = User;
