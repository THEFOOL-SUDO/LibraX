const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const isProduction = process.env.NODE_ENV === 'production';
const hasJwtSecret = typeof process.env.JWT_SECRET === 'string' && process.env.JWT_SECRET.trim().length > 0;

if (!hasJwtSecret && isProduction) {
  throw new Error('Missing required environment variable: JWT_SECRET');
}

if (!hasJwtSecret && !isProduction) {
  console.warn(
    '[Config] JWT_SECRET is missing. Using a development fallback secret. ' +
    'Create server/.env and set JWT_SECRET for consistent tokens.'
  );
}

const env = Object.freeze({
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 5000,
  JWT_SECRET: hasJwtSecret ? process.env.JWT_SECRET : 'libra_dev_fallback_secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  FINE_PER_DAY: Number(process.env.FINE_PER_DAY) || 5
});

module.exports = env;
