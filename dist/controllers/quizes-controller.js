"use strict";
// import Quiz from "../models/Quiz";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { HttpError } from "../helpers/index";
const index_1 = require("../decorators/index");
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const result = await Quiz.find({}, "-createdAt -updatedAt");
    // res.json(result);
});
const getAllByRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Прописать тоже самое что и в Алл, толлько методом сорт по рейтингу!
    // const result = await Quiz.Sort();
    // res.json(result);
});
const getById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // const result = await Quiz.findById(id);
    // if (!result) {
    //   throw HttpError(404, `Quiz with id=${id} not found`);
    // }
    // res.json(result);
});
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const result = await Quiz.create(req.body);
    // res.status(201).json(result);
});
const updateById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // const result = await Quiz.findByIdAndUpdate(id, req.body);
    // if (!result) {
    //   throw HttpError(404, `Quiz with id=${id} not found`);
    // }
    // res.json(result);
});
const deleteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // const result = await Quiz.findByIdAndDelete(id);
    // if (!result) {
    //   throw HttpError(404, `Quiz with id=${id} not found`);
    // }
    // res.json({ message: "Delete success" });
});
exports.default = {
    getAll: (0, index_1.ctrlWrapper)(getAll),
    getById: (0, index_1.ctrlWrapper)(getById),
    add: (0, index_1.ctrlWrapper)(add),
    updateById: (0, index_1.ctrlWrapper)(updateById),
    deleteById: (0, index_1.ctrlWrapper)(deleteById),
};
