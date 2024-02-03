import { Schema, model } from "mongoose";
import Joi from "joi";

import { handleSaveError, addUpdateSetting } from "./hooks.js";

const quizSchema = new Schema(
  {
    theme: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    background: {
      type: String,
    },
    ageGroup: {
      type: String,
      required: true,
    },
    ratingQuantity: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    finished: {
      type: Number,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

quizSchema.post("save", handleSaveError);

quizSchema.pre("findOneAndUpdate", addUpdateSetting);

quizSchema.post("findOneAndUpdate", handleSaveError);

// export const quizAddSchema = Joi.object({
//   theme: Joi.string().required(),
//   category: Joi.string().required(),
//   background: Joi.string(),
//   ageGroup: Joi.string().required(),
//   ratingQuantity: Joi.number().required(),
//   rating: Joi.number().required(),
//   finished: Joi.number().required(),
// });

// export const quizUpdateSchema = Joi.object({
//   theme: Joi.string(),
//   category: Joi.string(),
//   background: Joi.string(),
//   ageGroup: Joi.string(),
//   ratingQuantity: Joi.number(),
//   rating: Joi.number(),
//   finished: Joi.number(),
// });

// export const quizUpdateFavoriteSchema = Joi.object({});

const Quiz = model("quizes", quizSchema);

export default Quiz;
