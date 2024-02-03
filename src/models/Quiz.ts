import mongoose, { Document, Schema, Types } from 'mongoose';

interface Quiz {
    theme: string;
    category: Schema.Types.ObjectId;
    ageGroup: string;
    ratingQuantity: number;
    rating: number;
    finished: number;
}

const quizSchema = new Schema<Quiz & Document>(
    {
        theme: { type: String, required: true },
        category: { type: Schema.Types.ObjectId, required: true, ref: 'auth' },
        ageGroup: { type: String, required: true },
        ratingQuantity: { type: Number, required: true },
        rating: { type: Number, required: true },
        finished: { type: Number, required: true },
    },
    { timestamps: true, versionKey: false }
);

const Quiz = mongoose.model<Quiz & Document>('quizes', quizSchema);

export default Quiz;
