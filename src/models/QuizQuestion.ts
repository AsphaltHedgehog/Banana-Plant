import mongoose, { Document, Schema } from 'mongoose';

interface Answer {
  descr: string;
  _id: Schema.Types.ObjectId;
}

const answerSchema = new Schema<Answer>({
  descr: { type: String, required: true },
});

interface QuizQuestion {
    quiz: Schema.Types.ObjectId;
    time: string;
    descr: string;
    answers: Answer[];
    validAnswer: Schema.Types.ObjectId;
    imageUrl: string;
    type: 'full-text' | 'true-or-false';
};

const quizQuestionSchema = new Schema<QuizQuestion & Document>(
    {
        quiz: { type: Schema.Types.ObjectId, required: true },
        time: { type: String, required: true },
        descr: { type: String, required: true },
        answers: [answerSchema],
        validAnswer: { type: Schema.Types.ObjectId },
        imageUrl: { type: String, required: false, default: ''},
        type: { type: String, required: true, enum: ['full-text', 'true-or-false'] },
    },
    { timestamps: true, versionKey: false }
);

const QuizQuestion = mongoose.model<QuizQuestion & Document>('quizQuestion', quizQuestionSchema);

export default QuizQuestion;
