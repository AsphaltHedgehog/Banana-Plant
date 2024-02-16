import { promisify } from 'util';
import { Request, Response } from 'express';
import User from '../models/User';
import { HttpError } from '../helpers';
import { ctrlWrapper } from '../decorators/index';
import { cloudinary } from '../conf/envConfs';
import fs from 'fs/promises';

const userInfo = async (req: Request, res: Response) => {
    const { _id, name, avatarURL, email, favorite } = req.body.user;
    res.status(201).json({
        status: 'OK',
        code: 201,
        data: { user: { _id, name, avatarURL, email, favorite } },
    });
};

const updateInfo = async (req: Request, res: Response) => {
    const { _id } = req.body.user;
    const { name } = req.body;

    await User.findByIdAndUpdate(_id, { name }, { new: true });

    res.status(201).json({
        status: 'OK',
        code: 201,
        data: { name },
    });
};

const favorite = async (req: Request, res: Response) => {
    const user = req.body.user;
    const favoriteID = req.body.favorite;

    const index = user.favorite.indexOf(favoriteID);
    if (index === -1) {
        await User.findByIdAndUpdate(user.id, {
            $push: { favorite: favoriteID },
        });
        res.status(201).json({
            status: 'OK',
            code: 201,
            message: 'user favorite successfully added',
        });
    } else {
        await User.findByIdAndUpdate(
            user.id,
            { $pull: { favorite: favoriteID } },
            { new: true }
        );
        res.status(204).json({});
    }
    return;
};

const updateAvatar = async (req: Request, res: Response) => {
    const { _id } = req.body.user;

    // work with img
    if (!req.file || !req.file.path) {
        throw HttpError(400, 'Bad Request');
    }

    const cloudinaryUpload = promisify(cloudinary.uploader.upload);
    const result = await cloudinaryUpload(req.file.path);

    await fs.unlink(req.file.path);

    if (!result) {
        throw HttpError(500, 'file upload failed');
    }

    const updatedUser = await User.findByIdAndUpdate(
        _id,
        { avatarURL: result.public_id },
        { new: true }
    );

    if (!updatedUser) {
        throw HttpError(400, 'User not found');
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
};

const addPassedQuiz = async (req: Request, res: Response) => {
    const { _id } = req.body.user;
    const { quizId, quantityQuestions, correctAnswers, rating } = req.body;

    const user = await User.findById(_id);

    if (!user) {
        throw HttpError(400, 'User not found');
    }

    const { passedQuizzes } = user;

    const isPassedQuiz = passedQuizzes.find(quiz => quiz.quizId === quizId);

    if (isPassedQuiz) {
        await User.findByIdAndUpdate(isPassedQuiz._id, {
            quantityQuestions,
            correctAnswers,
            rating,
        });
    }

    const result = await User.findByIdAndUpdate(
        _id,
        {
            $addToSet: { passedQuizzes: req.body },
            $inc: {
                totalQuestions: quantityQuestions,
                totalAnswers: correctAnswers,
            },
        },
        {
            new: true,
            select: 'totalAnswers totalQuestions average passedQuizzes',
        }
    );

    if (!result) {
        throw HttpError(400, 'User not found');
    }

    result.average = Math.round(
        (result.totalAnswers / result.totalQuestions) * 100
    );
    res.json(result);
};

export const userController = {
    favorite: ctrlWrapper(favorite),
    userInfo: ctrlWrapper(userInfo),
    updateInfo: ctrlWrapper(updateInfo),
    updateAvatar: ctrlWrapper(updateAvatar),
    addPassedQuiz: ctrlWrapper(addPassedQuiz),
};
