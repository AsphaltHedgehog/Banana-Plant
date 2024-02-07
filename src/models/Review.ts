import mongoose, { Schema, Document } from 'mongoose';

interface IReview extends Document {
    username: string;
    avatarUrl?: string;
    rating: number;
    comment: string;
    createdAt: Date;
}

const reviewSchema = new Schema<IReview>({
    username: {
        type: String,
        required: true,
    },
    avatarUrl: {
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
