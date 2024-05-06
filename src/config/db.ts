import mongoose from 'mongoose';
import { config } from './config';

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => {
      console.log('Database Connected ...');
    });

    mongoose.connection.on('error', (err) => {
      console.log('error' + err.message);
    });

    await mongoose.connect(config.mongoURI as string);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

export default connectDB;
