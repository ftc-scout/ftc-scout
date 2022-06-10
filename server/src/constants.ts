export const SECOND_MS = 1000;
export const MINUTE_MS = SECOND_MS * 60;
export const HOUR_MS = MINUTE_MS * 60;
export const DAY_MS = HOUR_MS * 24;
export const YEAR_MS = DAY_MS * 365;

export const IS_PROD = process.env.NODE_ENV === "production";
export const IS_DEV = !IS_PROD;

export const SERVER_PORT = 4000;

const DEV_WEB_ORIGIN = "http://localhost:3000";
const PROD_WEB_ORIGIN = "TODO";
export const WEB_ORIGIN = IS_DEV ? DEV_WEB_ORIGIN : PROD_WEB_ORIGIN;

export const DB_HOST = "localhost";
export const DB_PORT = 5432;
export const DB_NAME = "ftc-scout";
export const DB_USERNAME = process.env.DB_USERNAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;

export const COOKIE_NAME = "ftc-scout-cookie";
export const COOKIE_AGE = YEAR_MS * 10;
export const SESSION_SECRET = "TODO CHANGE SECRET"; // TODO change secret

export const REDIS_PORT = 6379;
export const REDIS_ORIGIN = "127.0.0.1";

export const FTC_API_KEY = process.env.FTC_API_KEY;

export const CURRENT_SEASON = 2021;
