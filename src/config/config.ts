import { config as conf } from 'dotenv';

conf();

const _config = {
  port1: process.env.PORT1,
  port2: process.env.PORT2,
  port3: process.env.PORT3,
  mongoURI: process.env.MONGODB_URI,
  env: process.env.NODE_ENV,
  jwtSecret: process.env.JWT_SECERET,
  cloudName: process.env.CLOUD_NAME,
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECERET,
};

export const config = Object.freeze(_config);
