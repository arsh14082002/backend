import app from './src/app';
import { config } from './src/config/config';
import connectDB from './src/config/db';
import dotenv from 'dotenv';

dotenv.config();

// const PORT = process.env.PORT1 || process.env.PORT2 || process.env.PORT3 || 18012 || 18012 || 19099;
// const PORT = 8081;

const PORT = 3000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
