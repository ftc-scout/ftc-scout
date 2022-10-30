import { PUBLIC_SERVER_ORIGIN } from "$env/static/public";

export const IS_PROD = process.env.NODE_ENV === "production";
export const IS_DEV = !IS_PROD;

export const SERVER_ORIGIN = PUBLIC_SERVER_ORIGIN;

export const CURRENT_SEASON = 2022;
export const ALL_SEASONS = [2019 as const, 2020 as const, 2021 as const, 2022 as const];
export type Season = 2022 | 2021 | 2020 | 2019;

export const EMAIL = "contact@ftcscout.org";
