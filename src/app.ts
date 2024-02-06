import express, { NextFunction, Request, Response } from 'express';
import logger from 'morgan';
import cors from 'cors';
import 'dotenv/config';
import bodyParser from 'body-parser';
// import reviewsRouter from "./routes/api/reviews-router.js";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import quizesRouter from './routes/api/quizes-router.js';
import router from './routes/api/auth.js';
import userRouter from './routes/api/user.js';
import quizQuestionRoute from './routes/api/quiz-question';

const app = express();

const formatsLogger: string =
    app.get('env') === 'development' ? 'dev' : 'short';

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// auth routes
app.use('/api/auth', router);

// app.use('api/reviews', reviewsRoutes);

// get sorted quizes routes
app.use('/api/quizes', quizesRouter);

// quizQuestion routes
app.use('/api/quiz/question', quizQuestionRoute);

// swagger routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/user', userRouter);
// errors
interface CustomError extends Error {
    status?: number;
    message: string;
}

app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
});

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
    const { status = 500, message = 'Server error' } = err;
    res.status(status).json({ message });
});

export default app;
