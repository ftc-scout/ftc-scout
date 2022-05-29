export const IS_PROD = process.env.NODE_ENV === "production";
export const IS_DEV = !IS_PROD;

export const SERVER_PORT = 4000;

const DEV_WEB_ORIGIN = "http://localhost:3000";
const PROD_WEB_ORIGIN = "TODO";
export const WEB_ORIGIN = IS_DEV ? DEV_WEB_ORIGIN : PROD_WEB_ORIGIN;
