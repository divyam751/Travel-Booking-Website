require("dotenv").config();

const URI = process.env.MONGODB_URI;
const DB_NAME = "voyawanderDC";
const PORT = process.env.PORT || 8080;
const SECRET_KEY = process.env.SECRET_KEY;
const API_ENDPOINT = "api/v1";
const AUTH_MAIL_USER = process.env.AUTH_MAIL_USER;
const AUTH_MAIL_PASS = process.env.AUTH_MAIL_PASS;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;
const OTP_VALID_TIME = 600; //OTP valid up to "" in seconds
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

module.exports = {
  URI,
  DB_NAME,
  PORT,
  SECRET_KEY,
  API_ENDPOINT,
  AUTH_MAIL_USER,
  AUTH_MAIL_PASS,
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
  OTP_VALID_TIME,
  STRIPE_SECRET_KEY,
};
