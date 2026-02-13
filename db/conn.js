import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

export const all = process.env;
export const APP_ENV = process.env.APP_ENV;
export const APP_URL_PREFIX = process.env.APP_URL_PREFIX;
export const APP_PORT = process.env.APP_PORT;
export const MONGO_DB_ENDPOINT = process.env.MONGO_DB_ENDPOINT;

export const POSTGRES_DB_ENDPOINT = process.env.POSTGRES_DB_ENDPOINT;
export const POSTGRES_DB_PORT = process.env.POSTGRES_DB_PORT;
export const POSTGRES_DB_USERNAME = process.env.POSTGRES_DB_USERNAME;
export const POSTGRES_DB_PASSWORD = process.env.POSTGRES_DB_PASSWORD;
export const POSTGRES_DB_NAME = process.env.POSTGRES_DB_NAME;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export const SMTP_SENDER_EMAIL = process.env.SMTP_SENDER_EMAIL;
export const SMTP_RECEIVER_EMAIL = process.env.SMTP_RECEIVER_EMAIL;
export const SMTP_AUTH_USER = process.env.SMTP_AUTH_USERNAME;
export const SMTP_AUTH_PASS = process.env.SMTP_AUTH_PASS;
export const SMTP_HOST = process.env.SMTP_HOST;
export const SMTP_PORT = process.env.SMTP_PORT;
export const SMTP_SES_REGION = process.env.SMTP_SES_REGION;
export const SMTP_PORTAL_URL = process.env.SMTP_PORTAL_URL;
export const SMTP_PORTAL_CHANGE_URL = process.env.SMTP_PORTAL_CHANGE_URL;
export const CORS_DOMAIN = process.env.CORS_DOMAIN;
export const AUTO_LOGOUT_MINUTES = process.env.AUTO_LOGOUT_MINUTES;
export const DEFAULT_MERCHANT = process.env.DEFAULT_MERCHANT;
export const OTP_GENERATE_HOST = process.env.GENERATE_OTP;
export const OTP_VALIDATE_HOST = process.env.VALIDATE_OTP;
export const OTP_SERVICE_NAME = process.env.OTP_SERVICE_NAME;
export const OTP_PURPOSE = process.env.OTP_SERVICE_PURPOSE;
export const OTP_SERVICE_EXPIRY = process.env.OTP_SERVICE_EXPIRY;
export const ACCOUNT_LOCK_TIME_IN_MINUTES =
  process.env.ACCOUNT_LOCK_TIME_IN_MINUTES;
export const FAILED_ATTEMPTS = process.env.FAILED_ATTEMPTS;
export const APP_TOKEN = process.env.APP_TOKEN;
export const APP_STATE = process.env.APP_STATE;
/*SMTP PART */
let smtpConfig = {
  host: SMTP_HOST,
  port: 465, //587
  secure: true,
  auth: {
    user: SMTP_AUTH_USER,
    pass: SMTP_AUTH_PASS,
  },
  debug: true,
};
export const transporter = nodemailer.createTransport(smtpConfig);
/*SMTP PART */
