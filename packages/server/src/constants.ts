export const IS_PROD = process.env.NODE_ENV === "production";
export const IS_DEV = !IS_PROD;

export const DATABASE_URL = process.env.DATABASE_URL;
export const FTC_API_KEY = process.env.FTC_API_KEY;
export const SERVER_PORT = +process.env.PORT;

export const LOGGING = process.env.LOGGING === "1";
export const SYNC_DB = process.env.SYNC_DB === "1";
export const SYNC_API = process.env.SYNC_API !== "0";
export const CACHE_REQ = process.env.CACHE_REQ === "1" && IS_DEV;

export const FRONTEND_CODE = process.env.FRONTEND_CODE;
export const DB_TIMEOUT = process.env.DB_TIMEOUT;
export const SESSION_SECRET = process.env.SESSION_SECRET || "ftcscout-dev-secret-change-in-production";
