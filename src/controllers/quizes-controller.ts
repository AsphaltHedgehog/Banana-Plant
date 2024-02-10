import { Quiz, QuizCategory } from '../models/Quiz';
import { Request, Response } from 'express';
import { HttpError } from '../helpers/index';
import { ctrlWrapper } from '../decorators/index';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

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

const getQuizById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw HttpError(400, 'Invalid quiz ID');
        }

        const result = await Quiz.findOne({
            _id: new mongoose.Types.ObjectId(id),
        });

        if (!result) {
            throw HttpError(404, 'Quiz not found');
        }
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// const getQuizByCategory = async (
//     req: Request,
//     res: Response
// ): Promise<void> => {
//     const { category, page, pageSize, rating, finished, title, inputText } = req.query;
//   console.log(req.query)

//     const currentPage: number = page ? parseInt(page.toString(), 10) : 1;
//     const itemsPerPage: number = pageSize
//         ? parseInt(pageSize.toString(), 10)
//         : 4;

//     const startIndex: number = (currentPage - 1) * itemsPerPage;

//     let sortCriteria: any | undefined;

//     try {
//         const totalQuizzesCount = await Quiz.countDocuments({
//             ageGroup: category,
//         });

//         const resultQuizCategories = await QuizCategory.find({
//             ageGroup: category,
//         });

//         let resultQuizesByCategory;

//         if (Array.isArray(category)) {
//             resultQuizesByCategory = await Quiz.find({})
//                 .skip(startIndex)
//                 .limit(itemsPerPage);
//         } else {
//             resultQuizesByCategory = await Quiz.find({
//                 ageGroup: category,
//             })
//                 .skip(startIndex)
//                 .limit(itemsPerPage);
//         }

//         // let result;

//         // if (rating) {
//         //     result = resultQuizesByCategory
//         //         .sort((a, b) => (a.rating > b.rating ? -1 : 1))
//         //         .find(a => a.rating < +rating);
//         // } else {
//         //     result = resultQuizesByCategory.sort((a, b) =>
//         //         a.finished > b.finished ? -1 : 1
//         //     );
//       // }
//        let newResult;
//        if (title) {
//            newResult = resultQuizCategories
//                .filter(a => (a.title === title ? a : null))
//                .map(a => a._id);
//        } else {
//            newResult = resultQuizCategories;
//        }

        // TODO: при умові відсутності title
//         const result = resultQuizesByCategory
//             .filter(a =>
//                 inputText
//                     ? a.theme.toLowerCase().includes(inputText.toLowerCase())
//                     : a
//             )
//             .map(res => {
//                 res.category.toString() === newResult.toString() ? res : 1;
//             });

//         res.json({
//             data: result,
//             categories: resultQuizCategories,
//             currentPage,
//             pageSize: itemsPerPage,
//             totalPages: Math.ceil(totalQuizzesCount / itemsPerPage),
//             totalQuizzesCount,
//         });
//     }

//     if (category || rating || finished || title || inputText) {
//         const matchStage = {};

//         // Додавання фільтрів
//         if (category) {
//             matchStage.ageGroup = category;
//         }

//         if (title) {
//             matchStage.title = title;
//         }
        
//         pipeline.push(
//           {
//             $match: matchStage,
//           },
//           {
//             $skip: startIndex,
//           },
//           {
//             $limit: itemsPerPage,
//           },
          
//           );
          
         
//         console.log(pipeline);
//     }

// const result = await Quiz.aggregate(pipeline);
//         console.log(result);
//         res.status(201).json(result);
// };


const getAllCategory = async (req: Request, res: Response): Promise<void> => {

    const result = await QuizCategory.find()
    

    res.status(200).json({
        status: 'OK',
        code: 200,
        data: {
            result
        }
    });
};

interface IMatchStage {
    ageGroup?: string;
    rating?: object;
    category?: object;
    theme?: string;
    finished?: object;
}

const getQuizByCategory = async (req: Request, res: Response): Promise<void> => {
    const { category, page, pageSize, rating, finished, title, inputText } = req.query;
    const matchStage: IMatchStage = {};
    const pipeline = [];

    if (category && typeof category === 'string') {
        matchStage.ageGroup = category;
    };
    
    if (rating && typeof rating === 'string') {
        matchStage.rating = { $lte: parseInt(rating) };
    };

    if (title && typeof title === 'string') {
        matchStage.category = new ObjectId(title);
    };

    if (inputText && typeof inputText === 'string') {
        matchStage.theme = inputText;
    };

    if (finished && typeof finished === 'string') {
        matchStage.finished = { $lte: parseInt(finished) };
    };


    pipeline.push(
        { $match: matchStage });
        

    const totalResult = await Quiz.aggregate(pipeline);

    const categoryCategory = await QuizCategory.find()
    
    if (page && typeof page === 'string') {
        pipeline.push({ $skip: parseInt(page as string) - 1 });
    }
    
    if (pageSize && typeof pageSize === 'string') {
        pipeline.push({ $limit: parseInt(pageSize as string) });
    }
    
    const result = await Quiz.aggregate(pipeline);
    

    res.status(200).json({
        status: 'OK',
        code: 200,
        data: {
            result,
            category: categoryCategory,
            total: totalResult.length
        }
    });
};



const addNewQuiz = async (req: Request, res: Response): Promise<void> => {
    const { theme } = req.body;
    const { id } = req.body.user;

    const categories = await QuizCategory.find({ ageGroup: 'adults' });
    if (!categories) {
        throw HttpError(400, 'DB is not available');
    }

    const result = await Quiz.create({ theme, owner: id });
    const { _id, background, ageGroup } = result;

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

    const { user } = req.body;
    const quiz = await Quiz.findById(id);

    if (!quiz) {
        throw HttpError(404, 'Bad Request');
    }

    if (quiz.owner.toString() !== user._id.toString()) {
        throw HttpError(401, 'Unauthorized');
    }

    const { ...updatedData } = req.body;

    const existingQuiz = await Quiz.findByIdAndUpdate(
        id,
        { updatedData },
        {
            new: true,
        }
    );
    if (!existingQuiz) {
        res.status(404).json({ error: 'Quiz not found' });
        return;
    }

    res.status(200).json(existingQuiz);
};

const deleteQuizById = async (req: Request, res: Response): Promise<void> => {
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
    getQuizById: ctrlWrapper(getQuizById),
    getAllCategory: ctrlWrapper(getAllCategory),
    getQuizByCategory: ctrlWrapper(getQuizByCategory),
    addNewQuiz: ctrlWrapper(addNewQuiz),
    updateQuizById: ctrlWrapper(updateQuizById),
    deleteQuizById: ctrlWrapper(deleteQuizById),
};
