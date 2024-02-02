// import Quiz from "../models/Quiz";
// import fs from "fs/promises";

import { Request, Response } from "express";

import { cloudinary } from "../helpers/index.js";

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
  // const result = await Quiz.create(req.body);
  // res.status(201).json(result);
};
// const add = async (req: Request, res: Response): Promise<void> => {
//   const { _id: owner } = req.user;
//   const { url: poster } = await cloudinary.uploader.upload(req.file.path, {
//     folder: "posters",
//   });

//   await fs.unlink(req.file.path);

//   const result = await Movie.create({ ...req.body, poster, owner });

//   res.status(201).json(result);
// };

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
