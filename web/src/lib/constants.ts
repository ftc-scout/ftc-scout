import { PUBLIC_SERVER_ORIGIN } from "$env/static/public";

export const IS_PROD = process.env.NODE_ENV === "production";
export const IS_DEV = !IS_PROD;

export const SERVER_ORIGIN = PUBLIC_SERVER_ORIGIN;

export const CURRENT_SEASON = 2021;

export const EMAIL = "robotics@k12.xrds.org";
