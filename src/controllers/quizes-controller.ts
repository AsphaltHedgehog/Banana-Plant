import Quiz from '../models/Quiz';
import { Request, Response } from 'express';
import { HttpError } from '../helpers/index';
import { ctrlWrapper } from '../decorators/index';
import mongoose, { ObjectId } from 'mongoose';

const getAll = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await Quiz.find({}, '-createdAt -updatedAt');
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

const getAllByRating = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await Quiz.find({}, '-createdAt -updatedAt').sort({
            rating: -1,
        }); // Сортування за зменшенням рейтингу

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


//TODO: create a pagination function
const getQuizesByCategory = async (
    req: Request,
    res: Response
): Promise<void> => {
  const { category, page, pageSize } = req.query;

  //FIXME: change pageSize and pirPage
  const currentPage: number = page ? parseInt(page.toString(), 8) : 1;
  const itemsPerPage: number = pageSize
      ? parseInt(pageSize.toString(), 10)
      : 10;

    let result;
    try {
        if (category === 'adults') {
            result = await Quiz.find({ ageGroup: 'adults' });
        }
        if (category === 'children') {
            result = await Quiz.find({ ageGroup: 'children' });
        }
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

const addNewQuize = async (req: Request, res: Response): Promise<void> => {
    try {
        const { theme, ageGroup }: { theme: string; ageGroup: string } =
            req.body;
        const result = await Quiz.find({ ageGroup: ageGroup });

        const arrQuizesCategory: ObjectId[] = result.map(q => q.category);

        const quizInfo = new Quiz({
            theme: theme,
            ageGroup: ageGroup,
            category: arrQuizesCategory,
            background: 'none',
        });

        res.status(201).json(quizInfo);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

const updateQuizeById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: 'Invalid quiz ID' });
            return;
        }

        const { _id, ...updatedData } = req.body;

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
