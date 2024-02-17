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
exports.userController = void 0;
const util_1 = require("util");
const User_1 = __importDefault(require("../models/User"));
const helpers_1 = require("../helpers");
const index_1 = require("../decorators/index");
const envConfs_1 = require("../conf/envConfs");
const promises_1 = __importDefault(require("fs/promises"));
const userInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, name, avatarURL, email, favorite } = req.body.user;
    res.status(201).json({
        status: 'OK',
        code: 201,
        data: { user: { _id, name, avatarURL, email, favorite } },
    });
});
const updateInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.body.user;
    const { name } = req.body;
    yield User_1.default.findByIdAndUpdate(_id, { name }, { new: true });
    res.status(201).json({
        status: 'OK',
        code: 201,
        data: { name },
    });
});
const favorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body.user;
    const favoriteID = req.body.favorite;
    const index = user.favorite.indexOf(favoriteID);
    if (index === -1) {
        yield User_1.default.findByIdAndUpdate(user.id, {
            $push: { favorite: favoriteID },
        });
        res.status(201).json({
            status: 'OK',
            code: 201,
            message: 'user favorite successfully added',
        });
    }
    else {
        yield User_1.default.findByIdAndUpdate(user.id, { $pull: { favorite: favoriteID } }, { new: true });
        res.status(204).json({});
    }
    return;
});
const updateAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.body.user;
    // work with img
    if (!req.file || !req.file.path) {
        throw (0, helpers_1.HttpError)(400, 'Bad Request');
    }
    const cloudinaryUpload = (0, util_1.promisify)(envConfs_1.cloudinary.uploader.upload);
    const result = yield cloudinaryUpload(req.file.path);
    yield promises_1.default.unlink(req.file.path);
    if (!result) {
        throw (0, helpers_1.HttpError)(500, 'file upload failed');
    }
    const updatedUser = yield User_1.default.findByIdAndUpdate(_id, { avatarURL: result.public_id }, { new: true });
    if (!updatedUser) {
        throw (0, helpers_1.HttpError)(400, 'User not found');
    }
    const { avatarURL } = updatedUser;
    res.status(201).json({
        status: 'OK',
        code: 201,
        data: {
            _id,
            avatarURL,
        },
    });
});
const addPassedQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.body.user;
    const { quizId, quantityQuestions, correctAnswers, rating } = req.body;
    console.log(1);
    const user = yield User_1.default.findById(_id);
    if (!user) {
        throw (0, helpers_1.HttpError)(400, 'User not found');
    }
    const { passedQuizzes } = user;
    const isPassedQuiz = passedQuizzes.find(quiz => quiz.quizId === quizId);
    if (isPassedQuiz) {
        yield User_1.default.findByIdAndUpdate(isPassedQuiz._id, {
            quantityQuestions,
            correctAnswers,
            rating,
        });
    }
    const result = yield User_1.default.findByIdAndUpdate(_id, {
        $addToSet: {
            passedQuizzes: {
                quizId,
                quantityQuestions,
                correctAnswers,
                rating,
            },
        },
        $inc: {
            totalQuestions: quantityQuestions,
            totalAnswers: correctAnswers,
        },
    }, {
        new: true,
        select: 'totalAnswers totalQuestions average passedQuizzes',
    });
    if (!result) {
        throw (0, helpers_1.HttpError)(400, 'User not found');
    }
    result.average = Math.round((result.totalAnswers / result.totalQuestions) * 100);
    res.json(result);
});
exports.userController = {
    favorite: (0, index_1.ctrlWrapper)(favorite),
    userInfo: (0, index_1.ctrlWrapper)(userInfo),
    updateInfo: (0, index_1.ctrlWrapper)(updateInfo),
    updateAvatar: (0, index_1.ctrlWrapper)(updateAvatar),
    addPassedQuiz: (0, index_1.ctrlWrapper)(addPassedQuiz),
};
