import mongoose from 'mongoose';
import { Book } from './bookTypes';
const mongoosePaginate = require('mongoose-paginate-v2');

const bookSchema = new mongoose.Schema<Book>(
  {
    title: {
      type: String,
      required: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    coverImage: {
      type: String,
      required: true,
    },

    file: {
      type: String,
      required: true,
    },

    genre: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

bookSchema.plugin(mongoosePaginate);

export default mongoose.model<Book>('Books', bookSchema);
