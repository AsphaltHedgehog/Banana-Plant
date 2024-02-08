import mongoose, { Schema, Document } from 'mongoose';

interface IReview extends Document {
    userName: string;
    avatarUrl?: string;
    review: string;
}

const reviewSchema = new Schema<IReview>({
    userName: {
        type: String,
        required: true,
    },
    avatarUrl: {
        type: String,
    },
    review: {
        type: String,
        required: true,
    },
}, { versionKey: false, timestamps: true });

const Review = mongoose.model<IReview>('review', reviewSchema);

export default Review;
