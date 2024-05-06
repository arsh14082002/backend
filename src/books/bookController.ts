import path from 'node:path';
import fs from 'node:fs';
import { Request, Response, NextFunction, raw } from 'express';
import { cloudinary } from '../config/cloudinary';
import createHttpError from 'http-errors';
import bookModel from './bookModel';
import { AuthRequest } from '../middleware/authenticate';

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre, description } = req.body;

  // console.log(title);

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const coverImageMimeType = files.coverImage[0].mimetype.split('/').at(-1);
  const fileName = files.coverImage[0].filename;
  const filePath = path.resolve(__dirname, '../../public/data/uploads', fileName);

  const bookFileName = files.file[0].filename;
  const bookFilePath = path.resolve(__dirname, '../../public/data/uploads', bookFileName);

  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: 'book-covers',
      format: coverImageMimeType,
    });

    const bookFileUploadResult = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: 'raw',
      filename_override: bookFileName,
      folder: 'book-pdfs',
      format: 'pdf',
    });

    // console.log(bookFileUploadResult);

    // console.log(uploadResult);
    // @ts-ignore
    // console.log(req.userId);
    const _req = req as AuthRequest;
    const newBook = await bookModel.create({
      title,
      genre,
      description,
      author: _req.userId,
      coverImage: uploadResult.secure_url,
      file: bookFileUploadResult.secure_url,
    });

    await fs.promises.unlink(filePath);
    await fs.promises.unlink(bookFilePath);

    res.status(200).json({
      // id: newBook._id,
      book: newBook,
    });
  } catch (error) {
    return next(createHttpError(500, 'error while uploading the files'));
  }
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const bookId = req.params.bookId;

  const book = await bookModel.findOne({ _id: bookId });

  if (!book) {
    return next(createHttpError(404, 'Book Not Found'));
  }

  //check author's book validation
  const _req = req as AuthRequest;
  if (book.author.toString() !== _req.userId) {
    return next(createHttpError(403, 'Unauthorised Author'));
  }

  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let completeCoverImage = '';

    if (files.coverImage) {
      const filename = files.coverImage[0].filename;

      const coverImageMimeType = files.coverImage[0].mimetype.split('/').at(-1);

      const filePath = path.join(__dirname, '../../public/data/uploads', filename);

      completeCoverImage = filename;

      const uploadResult = await cloudinary.uploader.upload(filePath, {
        filename_override: completeCoverImage,
        folder: 'book-covers',
        format: coverImageMimeType,
      });

      // console.log(uploadResult);

      completeCoverImage = uploadResult.secure_url;

      await fs.promises.unlink(filePath);
    }

    let completeFileName = '';
    if (files.file) {
      const fileName = files.file[0].filename;
      const bookFilePath = path.join(__dirname, '../../public/data/uploads', fileName);

      const bookFileName = files.file[0].filename;
      completeFileName = bookFileName;

      const uploadResultPdf = await cloudinary.uploader.upload(bookFilePath, {
        resource_type: 'raw',
        filename_override: completeFileName,
        folder: 'book-pdfs',
        format: 'pdf',
      });

      completeFileName = uploadResultPdf.secure_url;

      await fs.promises.unlink(bookFilePath);
    }

    const updateBook = await bookModel.findOneAndUpdate(
      {
        _id: bookId,
      },

      {
        title: title,
        genre: genre,
        coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
        file: completeFileName ? completeFileName : book.file,
      },

      {
        new: true,
      },
    );

    res.json({ updateBook });
  } catch (error) {
    return res.json({ message: error });
  }
};

const listBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await bookModel.find().populate('author', 'name email').sort({ updatedAt: -1 });

    const countBooks = await bookModel.countDocuments();

    res.json({ books, count: countBooks });
  } catch (error) {
    return next(createHttpError(500, 'Error while getting'));
  }
};

const getSingleBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookId = req.params.bookId;
    const book = await bookModel.findById({ _id: bookId }).populate('author', 'name');

    res.json({ book });
  } catch (error) {
    return next(createHttpError(500, 'Error while getting'));
  }
};

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookId = req.params.bookId;

    const book = await bookModel.findById({ _id: bookId });

    //check author book validation
    const _req = req as AuthRequest;
    if (book?.author.toString() !== _req.userId) {
      return next(createHttpError(401, 'Unauthorised author'));
    }

    const coverFileSplits = book.coverImage.split('/');
    const coverPublicSplits =
      coverFileSplits.at(-2) + '/' + coverFileSplits.at(-1)?.split('.').at(-2);

    const pdfFileSplits = book.file.split('/');
    const pdfPublicSplits = pdfFileSplits.at(-2) + '/' + pdfFileSplits.at(-1)?.split('.').at(-2);

    console.log(pdfPublicSplits);

    await cloudinary.uploader.destroy(coverPublicSplits);
    await cloudinary.uploader.destroy(pdfPublicSplits, {
      resource_type: 'raw',
    });

    await bookModel.deleteOne({ _id: bookId });

    res.sendStatus(204);
  } catch (error) {
    return next(createHttpError(500, 'Unauthorised author'));
  }
};

export { createBook, updateBook, listBook, getSingleBook, deleteBook };
