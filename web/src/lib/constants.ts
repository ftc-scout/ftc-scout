export const IS_PROD = process.env.NODE_ENV === "production";
export const IS_DEV = !IS_PROD;

const DEV_SERVER_ORIGIN = "http://localhost:4000/graphql";
const PROD_SERVER_ORIGIN = "TODO";
export const SERVER_ORIGIN = IS_DEV ? DEV_SERVER_ORIGIN : PROD_SERVER_ORIGIN;