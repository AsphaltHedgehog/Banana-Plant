import Quiz from '../models/Quiz';
import { Request, Response } from 'express';
// import { HttpError } from "../helpers/index";
import { ctrlWrapper } from '../decorators/index';
import mongoose from 'mongoose';

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await Quiz.find({}, '-createdAt -updatedAt');
    res.json(result);
  } catch (error) {
    console.error('Помилка отримання даних:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllByRating = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await Quiz.find({}, '-createdAt -updatedAt').sort({
      rating: -1,
    }); // Сортування за зменшенням рейтингу

    res.json(result);
  } catch (error) {
    console.error('Помилка отримання даних:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

import { ObjectId } from 'mongoose';

const getQuizeById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid quiz ID' });
      return;
    }

    const result = await Quiz.findOne({_id: new mongoose.Types.ObjectId(id)});

    if (!result) {
      res.status(404).json({ error: 'Quiz not found' });
      return;
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Помилка отримання даних:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const add = async (req: Request, res: Response): Promise<void> => {
  // const result = await Quiz.create(req.body);
  // res.status(201).json(result);
};

const updateById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  // const result = await Quiz.findByIdAndUpdate(id, req.body);
  // if (!result) {
  //   throw HttpError(404, `Quiz with id=${id} not found`);
  // }

  // res.json(result);
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  // const result = await Quiz.findByIdAndDelete(id);
  // if (!result) {
  //   throw HttpError(404, `Quiz with id=${id} not found`);
  // }

  // res.json({ message: "Delete success" });
};

export default {
  getAll: ctrlWrapper(getAll),
  getAllByRating: ctrlWrapper(getAllByRating),
  getQuizeById: ctrlWrapper(getQuizeById),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  deleteById: ctrlWrapper(deleteById),
};
