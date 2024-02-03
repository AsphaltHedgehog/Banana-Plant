import mongoose, { Document, Schema } from 'mongoose';


interface Answer {
  descr: string;
  id: string;
}

const answerSchema = new Schema<Answer>({
  descr: { type: String, required: true },
  id: { type: String, required: true }
});

interface QuizQuestion {
    quiz: Schema.Types.ObjectId;
    time: string;
    descr: string;
    answers: Answer[];
    validAnswer: string;
    imageUrl: string;
    type: 'full-text' | 'true-or-false';
};


const quizQuestionSchema = new Schema<QuizQuestion & Document>(
    {
        quiz: { type: Schema.Types.ObjectId, required: true },
        time: { type: String, required: true },
        descr: { type: String, required: true },
        answers: [answerSchema],
        validAnswer: { type: String, required: true },
        imageUrl: { type: String, required: false, default: '' },
        type: { type: String, required: true, enum: ['full-text', 'true-or-false']}
    },
    { timestamps: true, versionKey: false }
);

const QuizQuestion = mongoose.model<QuizQuestion & Document>('quizQuestion', quizQuestionSchema);

export default QuizQuestion;
