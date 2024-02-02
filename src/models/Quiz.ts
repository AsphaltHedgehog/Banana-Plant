import mongoose, { Document, Schema } from 'mongoose';

interface Quiz {
    theme: string;
    category: string;
    ageGroup: string;
    id: string;
    ratingQuantity: number;
    rating: number;
    finished: number;
}

const quizSchema = new Schema<Quiz & Document>(
    {
        theme: { type: String, required: true },
        category: { type: String, required: true },
        ageGroup: { type: String, required: true },
        id: { type: String, required: true },
        ratingQuantity: { type: Number, required: true },
        rating: { type: Number, required: true },
        finished: { type: Number, required: true },
    },
    { timestamps: true }
);

const Quiz = mongoose.model<Quiz & Document>('quizes', quizSchema);

export default Quiz;

// Временная затычка
