export const IS_PROD = process.env.NODE_ENV === "production";
export const IS_DEV = !IS_PROD;

// dark mode settings
export const THEME_COOKIE_NAME = "ftc-scout:theme";
export const THEME_COOKIE_AGE = 60 * 60 * 24 * 356 * 10;

// alert bar settings
export const ALERT_COOKIE_NAME = "ftc-scout:alert-dismissed";
export const ALERT_COOKIE_AGE = 60 * 60 * 24 * 7;
export const ALERT_ENABLED = false;
export const ALERT_MESSAGE =
    "We are excited to announce that FTCScout will support the 2023-2024 FIRST Tech Challenge season! Watch the game reveal for Center Stage using the arrow to the right.";
export const ALERT_LINK = "https://example.com";
export const ALERT_LINK_ENABLED = false;

// sidear contents
export const EMAIL = "contact@ftcscout.org";
export const DISCORD = "https://discord.gg/XTZhD9RnKa";
export const STATUS = "https://uptime.9021007.xyz/status/ftcscout";
export const GITHUB = "https://github.com/ftc-scout/ftc-scout";
