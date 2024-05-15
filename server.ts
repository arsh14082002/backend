import app from './src/app';
import { config } from './src/config/config';
import connectDB from './src/config/db';

const PORT = config.port1 || config.port2 || config.port3 || 18012 || 18013 || 19099;
// const PORT = 8081;

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
