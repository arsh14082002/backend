import express from 'express';
import { createUser, loginUser, logoutUser, userDetails } from './userController';
import { authenticate } from '../middleware/authenticate';

const userRouter = express.Router();

userRouter.post('/register', createUser);
userRouter.post('/login', loginUser);
userRouter.get('/logout', logoutUser);
userRouter.get('/me', authenticate, userDetails);

export { userRouter };
