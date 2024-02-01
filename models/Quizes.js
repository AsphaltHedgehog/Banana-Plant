import { Schema, model } from "mongoose";
import Joi from "joi";

import { handleSaveError, addUpdateSetting } from "./hooks.js";

const quizSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

quizSchema.post("save", handleSaveError);

quizSchema.pre("findOneAndUpdate", addUpdateSetting);

quizSchema.post("findOneAndUpdate", handleSaveError);

export const quizAddSchema = Joi.object({
  title: Joi.string().required().messages({
    "any.required": `"title" is a required field`,
  }),
});

export const quizUpdateSchema = Joi.object({
  title: Joi.string(),
});

// export const quizUpdateFavoriteSchema = Joi.object({
//   favorite: Joi.boolean().required(),
// });

const Quiz = model("quiz", quizSchema);

export default Quiz;
