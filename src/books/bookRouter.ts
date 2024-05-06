import express from 'express';
import multer from 'multer';
import { createBook, getSingleBook, listBook, deleteBook } from './bookController';
import path from 'node:path';
import { authenticate } from '../middleware/authenticate';
import { updateBook } from './bookController';

const bookRouter = express.Router();

// file store local ->
const upload = multer({
  dest: path.resolve(__dirname, '../../public/data/uploads'),
  limits: { fileSize: 3e7 },
});

bookRouter.post(
  '/',
  authenticate,
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'file', maxCount: 1 },
  ]),
  createBook,
);

bookRouter.patch(
  '/:bookId',
  authenticate,
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'file', maxCount: 1 },
  ]),
  updateBook,
);

bookRouter.get('/', listBook);

bookRouter.get('/:bookId', getSingleBook);

bookRouter.delete('/:bookId', authenticate, deleteBook);

export default bookRouter;
