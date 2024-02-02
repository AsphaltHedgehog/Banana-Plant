import Quiz from "../models/Quiz.js";

import { Request, Response } from "express";

import { HttpError } from "../helpers/index";

import { ctrlWrapper } from "../decorators/index";

const getAll = async (req: Request, res: Response): Promise<void> => {
  // const result = await Quiz.find({}, "-createdAt -updatedAt");
  // res.json(result);
};

const getAllByRating = async (req: Request, res: Response): Promise<void> => {
  // Прописать тоже самое что и в Алл, толлько методом сорт по рейтингу!
  // const result = await Quiz.Sort();
  // res.json(result);
};

const getById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  // const result = await Quiz.findById(id);
  // if (!result) {
  //   throw HttpError(404, `Quiz with id=${id} not found`);
  // }

  // res.json(result);
};

const add = async (req: Request, res: Response): Promise<void> => {
  console.log(req.body);
  const result = await Quiz.create(req.body);
  res.status(201).json(result);
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
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  deleteById: ctrlWrapper(deleteById),
};
