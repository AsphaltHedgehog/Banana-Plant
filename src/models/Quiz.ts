import mongoose, { Document, Schema } from 'mongoose';

interface Quiz {
    theme: string;
    category: Schema.Types.ObjectId;
    background: string;
    ageGroup: string;
    ratingQuantity: number;
    rating: number;
    finished: number;
    owner: Schema.Types.ObjectId;
}

interface QuizCategory {
    ageGroup: string;
    title: string;
};

const quizSchema = new Schema<Quiz & Document>(
    {
        theme: { type: String, required: true },
        category: { type: Schema.Types.ObjectId , ref: 'categories' },
        background: { type: String, default: "none"  },
        ageGroup: { type: String, default: 'adults' },
        ratingQuantity: { type: Number, default: 0 },
        rating: { type: Number, default: 0 },
        finished: { type: Number, default: 0 },
        owner: { type: Schema.Types.ObjectId, ref: 'users'}
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
