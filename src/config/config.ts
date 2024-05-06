import { config as conf } from 'dotenv';

conf();

const _config = {
  port: process.env.PORT,
  mongoURI: process.env.MONGODB_URI,
  env: process.env.NODE_ENV,
  jwtSecret: process.env.JWT_SECERET,
  cloudName: process.env.CLOUD_NAME,
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECERET,
};

export const config = Object.freeze(_config);
