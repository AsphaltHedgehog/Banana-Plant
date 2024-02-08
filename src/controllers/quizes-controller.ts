import { Quiz, QuizCategory } from '../models/Quiz';
import { Request, Response } from 'express';
import { HttpError, cloudinary } from '../helpers/index';
import { ctrlWrapper } from '../decorators/index';
// import fs from 'fs/promises';
import mongoose, { ObjectId } from 'mongoose';

const getAll = async (req: Request, res: Response): Promise<void> => {
    const { page, pageSize } = req.query;
    const currentPage: number = page ? parseInt(page.toString(), 10) : 1;
    const itemsPerPage: number = pageSize
        ? parseInt(pageSize.toString(), 10)
        : 4;

    try {
        const startIndex: number = (currentPage - 1) * itemsPerPage;
        const totalQuizzesCount = await Quiz.countDocuments({});

        const result = await Quiz.find({}, '-createdAt -updatedAt')
            .skip(startIndex)
            .limit(itemsPerPage);
        res.json({
            result,
            totalQuizes: totalQuizzesCount,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

const getAllByRating = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await Quiz.find({}, '-createdAt -updatedAt').sort({
            rating: -1,
        });

        res.json(result);
    } catch (error: any) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

const getQuizeById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw HttpError(400, 'Invalid quiz ID');
            return;
        }

        const result = await Quiz.findOne({
            _id: new mongoose.Types.ObjectId(id),
        });

        if (!result) {
            throw HttpError(404, 'Quiz not found');
            return;
        }
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

const getQuizesByCategory = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { category, page, pageSize, rating, finished, title, inputText } =
        req.query;

    const currentPage: number = page ? parseInt(page.toString(), 10) : 1;
    const itemsPerPage: number = pageSize
        ? parseInt(pageSize.toString(), 10)
        : 4;

    const startIndex: number = (currentPage - 1) * itemsPerPage;
    // let sortCriteria: any | undefined;

    try {
        const totalQuizzesCount = await Quiz.countDocuments({
            ageGroup: category,
        });

        const resultQuizCategories = await QuizCategory.find({
            ageGroup: category,
        });

<<<<<<< Updated upstream
        let sortCriteria: { [key: string]: 1 | -1 } | undefined;

        if (rating) {
            sortCriteria = {
                rating: parseInt(rating.toString(), 10) > 0 ? 1 : -1,
            };
        } else if (finished) {
            sortCriteria = {
                finished: parseInt(finished.toString(), 10) > 0 ? 1 : -1,
            };
        }

      let resultQuizesByCategory;
      
=======
        let resultQuizesByCategory;

>>>>>>> Stashed changes
        if (Array.isArray(category)) {
            resultQuizesByCategory = await Quiz.find({})
                .skip(startIndex)
                .limit(itemsPerPage);
        } else {
            resultQuizesByCategory = await Quiz.find({
                ageGroup: category,
            })
                .skip(startIndex)
                .limit(itemsPerPage);
        }
        let result;
        if (rating) {
            result = resultQuizesByCategory
                .sort((a, b) => (a.rating > b.rating ? -1 : 1))
                .filter(a => a.rating < +rating);
        } else {
            result = resultQuizesByCategory.sort((a, b) =>
                a.finished > b.finished ? -1 : 1
            );
        }

        res.json({
            // data: resultQuizesByCategory,
            data: result,
            categories: resultQuizCategories,
            currentPage,
            pageSize: itemsPerPage,
            totalPages: Math.ceil(totalQuizzesCount / itemsPerPage),
            totalQuizzesCount,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

const addNewQuize = async (req: Request, res: Response): Promise<void> => {
    try {
        //Добавление фотки не в квиз должно быть, а в вопрос квиза
        //         const { category } = req.body;
        //         if (!req.file || !req.file.path) {
        //             res.status(400).json({ error: 'No file uploaded' });
        //             return;
        //         }
        //         const { url: poster } = await cloudinary.uploader.upload(
        //             req.file.path,
        //             {
        //                 folder: 'posters',
        //             }
        //         );
        //         await fs.unlink(req.file.path);

<<<<<<< Updated upstream
        const { theme, ageGroup }: { theme: string; ageGroup: string } =
            req.body;
        const result = await Quiz.find({ ageGroup: ageGroup });
=======
    const categories = await QuizCategory.find({ ageGroup: 'adults' });
    if (!categories) {
        throw HttpError(400, 'DB is not available');
    }
>>>>>>> Stashed changes

        const arrQuizesCategory: ObjectId[] = result.map(q => q.category);

<<<<<<< Updated upstream
        const quizInfo = new Quiz({
            theme: theme,
            ageGroup: ageGroup,
            category: arrQuizesCategory,
            background: 'none',
        });

        quizInfo.save();

        res.status(201).json(quizInfo);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

const updateQuizeById = async (req: Request, res: Response): Promise<void> => {
    try {
        //         const { id } = req.params;

        //         if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        //             res.status(400).json({ error: 'Invalid quiz ID' });
        //             return;
        //         }

        // точно так же, обновление должно быть не напрямую в Квиз, а в Вопросы квиза
        //         const newQuize = new Quiz({
        //             ...req.body,
        //             category: categoryObjectId,
        //             poster,
        //         });
        //         const quize = await newQuize.save();

        const { id, ...updatedData } = req.body;

        const existingQuiz = await Quiz.findByIdAndUpdate(id, updatedData, {
            new: true,
        });
        if (!existingQuiz) {
            res.status(404).json({ error: 'Quiz not found' });
            return;
        }

        res.status(200).json(existingQuiz);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

const deleteQuizeById = async (req: Request, res: Response): Promise<void> => {
=======
    res.status(201).json({
        status: 'OK',
        code: 201,
        data: {
            _id,
            theme,
            categories,
            background,
            ageGroup,
        },
    });
};

const updateQuizById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: 'Invalid quiz ID' });
        return;
    }

    const { ...updatedData } = req.body;

    const existingQuiz = await Quiz.findByIdAndUpdate(id, updatedData, {
        new: true,
    });
    if (!existingQuiz) {
        res.status(404).json({ error: 'Quiz not found' });
        return;
    }

    res.status(200).json(existingQuiz);
};

const deleteQuizById = async (req: Request, res: Response): Promise<void> => {
>>>>>>> Stashed changes
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw HttpError(400, 'Invalid quiz ID');
            return;
        }

        const result = await Quiz.findByIdAndDelete(id);

        if (!result) {
            throw HttpError(404, 'Quiz not found');
            return;
        }

        res.status(204).json({ message: 'Quiz deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export default {
    getAll: ctrlWrapper(getAll),
    getAllByRating: ctrlWrapper(getAllByRating),
    getQuizeById: ctrlWrapper(getQuizeById),
    getQuizesByCategory: ctrlWrapper(getQuizesByCategory),
    addNewQuize: ctrlWrapper(addNewQuize),
    updateQuizeById: ctrlWrapper(updateQuizeById),
    deleteQuizeById: ctrlWrapper(deleteQuizeById),
};
