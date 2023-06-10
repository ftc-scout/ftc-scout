export const IS_PROD = process.env.NODE_ENV === "production";
export const IS_DEV = !IS_PROD;

export const DATABASE_URL = process.env.DATABASE_URL;
export const FTC_API_KEY = process.env.FTC_API_KEY;
export const SERVER_PORT = +process.env.PORT;

export const LOGGING = process.env.LOGGING === "1";
export const SYNC = process.env.SYNC === "1";
export const CACHE_REQ = process.env.CACHE_REQ === "1" && IS_DEV;
