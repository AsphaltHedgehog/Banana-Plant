import express, { NextFunction, Request, Response } from 'express';
import logger from "morgan";
import cors from "cors";
import "dotenv/config";
import quizesRouter from "./routes/api/quizes-router.js";
import bodyParser from 'body-parser';
import reviewsRouter from "./routes/api/reviews-router.js";



const app = express();

const formatsLogger: string = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/api/quizes", quizesRouter);
app.use('api/reviews', reviewsRoutes);

// errors

interface CustomError extends Error {
  status?: number;
  message: string;
}

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export default app;
