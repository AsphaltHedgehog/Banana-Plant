import mongoose, { Document, Schema } from 'mongoose';

interface Answer {
    descr: string;
    _id: Schema.Types.ObjectId;
}

const answerSchema = new Schema<Answer>({
    descr: { type: String, required: false },
});

export interface IQuizQuestion {
    quiz: Schema.Types.ObjectId;
    time: string;
    descr: string;
    answers: Answer[];
    validAnswer: Schema.Types.ObjectId;
    imageUrl: string;
    type: 'full-text' | 'true-or-false';
}

const quizQuestionSchema = new Schema<IQuizQuestion & Document>(
    {
        quiz: { type: Schema.Types.ObjectId, required: false },
        time: { type: String, required: false },
        descr: { type: String, required: false },
        answers: [answerSchema],
        validAnswer: { type: Schema.Types.ObjectId, required: false },
        imageUrl: { type: String, required: false, default: '' },
        type: {
            type: String,
            required: true,
            enum: ['full-text', 'true-or-false'],
        },
    },
    { timestamps: true, versionKey: false }
);

const QuizQuestion = mongoose.model<IQuizQuestion & Document>(
    'quizQuestion',
    quizQuestionSchema
);

export default QuizQuestion;
