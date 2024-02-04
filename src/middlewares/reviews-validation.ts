import validateBody from "../decorators/validateBody";
import reviewsSchema from "../schemas/reviewsSchema"; 

const addReviewValidate = validateBody(reviewsSchema.reviewsSchema);
const updateReviewValidate = validateBody(reviewsSchema.reviewsSchema);

export default {
  addReviewValidate,
  updateReviewValidate,
};
