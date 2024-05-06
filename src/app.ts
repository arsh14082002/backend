import express, { Request, Response, NextFunction } from 'express';
import createHttpError, { HttpError } from 'http-errors';
import { config } from './config/config';
import globalHandlerErrors from './middleware/globalHandlerErrors';
import { userRouter } from './user/userRouter';
import bookRouter from './books/bookRouter';
import cors from 'cors';

const app = express();

app.use(express.json());

app.use(cors());

app.get('/', (req, res, next) => {
  res.json({
    message: 'api calls',
  });
});

app.use('/api/users', userRouter);
app.use('/api/books', bookRouter);

app.use(globalHandlerErrors);

export default app;
