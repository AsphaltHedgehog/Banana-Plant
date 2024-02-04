import Joi from 'joi';

interface ReviewsSchema {
  rating: number;
  comment: string;
}

const reviewsSchema = Joi.object<ReviewsSchema>({
  rating: Joi.number()
    .required()
    .min(1)
    .max(5)
    .messages({ 'any.required': 'missing required rating field, *(1-5)' }),

  comment: Joi.string()
    .required()
    .messages({ 'any.required': 'missing required comment field, *(any string)' }),
});

export default { reviewsSchema };
