import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import userModel from './userModel';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { config } from '../config/config';
import { access } from 'fs';
import { User } from './userTypes';
import { AuthRequest } from '../middleware/authenticate';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  // Validation

  try {
    if (!name || !email || !password) {
      const error = createHttpError(400, 'All fields are required');
      return next(error);
    }
  } catch (error) {
    return next(createHttpError(500, 'error while creating user'));
  }

  try {
    const user = await userModel.findOne({ email });

    if (user) {
      const error = createHttpError(400, 'User Already exist with this email');
      return next(error);
    }
  } catch (error) {
    return next(createHttpError(500, 'error while creating user'));
  }

  //hashed password
  const hashedPassword = await bcrypt.hash(password, 10);

  let newUser: User;

  try {
    newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (error) {
    return next(createHttpError(500, 'error while creating user'));
  }

  let token;

  try {
    // token generation
    token = sign({ sub: newUser._id }, config.jwtSecret as string, {
      expiresIn: '7d',
      algorithm: 'HS256',
    });
  } catch (error) {
    return next(createHttpError(500, 'error while creating user'));
  }

  res.status(201).json({
    id: newUser._id,
    accessToken: token,
  });
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  // console.log(req.body);

  const user = await userModel.findOne({ email });

  if (!user) {
    return next(createHttpError(401, 'invalid credentials'));
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(createHttpError(401, 'invalid credentials'));
  }

  const token = sign({ sub: user._id }, config.jwtSecret as string, {
    expiresIn: '7d',
    algorithm: 'HS256',
  });

  //  console.log(user.name);

  res.status(201).json({
    id: user._id,
    accessToken: token,
    // message: 'Ok',
  });
};

const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  // console.log(req.body);

  //how to logout user?
  res.cookie('token', null, { expires: new Date(Date.now()), httpOnly: true });

  res.status(200).json({
    message: 'Ok',
  });
};

const userDetails = async (req: Request, res: Response, next: NextFunction) => {
  const _req = req as AuthRequest;
  const user = await userModel.findById(_req.userId);
  console.log(req.params.id);
  if (!user) {
    return next(createHttpError(404, 'User not found'));
  }

  res.status(200).json({
    id: user._id,
    name: user.name,
    email: user.email,
    // role: user.role,
  });
};

export { createUser, loginUser, logoutUser, userDetails };
