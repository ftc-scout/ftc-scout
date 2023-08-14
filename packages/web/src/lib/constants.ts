export const IS_PROD = process.env.NODE_ENV === "production";
export const IS_DEV = !IS_PROD;

export const THEME_COOKIE_NAME = "ftc-scout:theme";
export const THEME_COOKIE_AGE = 60 * 60 * 24 * 356 * 10;

export const EMAIL = "contact@ftcscout.org";
