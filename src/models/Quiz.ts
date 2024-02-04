import mongoose, { Document, Schema, Types } from 'mongoose';

interface Quiz {
    theme: string;
    category: Schema.Types.ObjectId;
    background: string;
    ageGroup: string;
    ratingQuantity: number;
    rating: number;
    finished: number;
}

interface QuizCategory {
  ageGroup: string;
  title: string;
}

const quizSchema = new Schema<Quiz & Document>(
    {
        theme: { type: String, required: true },
        category: [{ type: Schema.Types.ObjectId, required: true }],
        background: { type: String, required: true },
        ageGroup: { type: String, required: true },
        ratingQuantity: { type: Number, required: true },
        rating: { type: Number, required: true },
        finished: { type: Number, required: true },
    },
    { timestamps: true, versionKey: false }
);

const quizCategorySchema = new Schema<QuizCategory & Document>({
    ageGroup: { type: String, required: true },
    title: { type: String, required: true },
});

export const Quiz = mongoose.model<Quiz & Document>('quizes', quizSchema);

export const QuizCategory = mongoose.model<QuizCategory & Document>(
    'categories',
    quizCategorySchema
);

// export default Quiz;
