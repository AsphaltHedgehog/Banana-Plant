import Quiz from "../models/Quizes.js";

import { HttpError } from "../helpers/index.js";

import { ctrlWrapper } from "../decorators/index.js";

const getAll = async (req, res) => {
  const result = await Quiz.find({}, "-createdAt -updatedAt");

  res.json(result);
};

const getById = async (req, res) => {
  const { id } = req.params;
  // const result = await Quiz.findOne({id: id});
  const result = await Quiz.findById(id);
  if (!result) {
    throw HttpError(404, `Quiz with id=${id} not found`);
  }

  res.json(result);
};

const add = async (req, res) => {
  const result = await Quiz.create(req.body);

  res.status(201).json(result);
};

const updateById = async (req, res) => {
  const { id } = req.params;
  const result = await Quiz.findByIdAndUpdate(id, req.body);
  if (!result) {
    throw HttpError(404, `Quiz with id=${id} not found`);
  }

  res.json(result);
};

const deleteById = async (req, res) => {
  const { id } = req.params;
  const result = await Quiz.findByIdAndDelete(id);
  if (!result) {
    throw HttpError(404, `Quiz with id=${id} not found`);
  }

  res.json({
    message: "Delete success",
  });
};

export default {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  deleteById: ctrlWrapper(deleteById),
};
