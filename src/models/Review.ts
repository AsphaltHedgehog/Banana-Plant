import mongoose, { Schema, Document } from 'mongoose';

interface IReview extends Document {
    username: string;
    avatar?: string;
    rating: number;
    comment: string;
    createdAt: Date;
}

const reviewSchema = new Schema<IReview>({
    username: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Review = mongoose.model<IReview>('review', reviewSchema);

export default Review;
