export const IS_PROD = process.env.NODE_ENV === "production";
export const IS_DEV = !IS_PROD;

// dark mode settings
export const THEME_COOKIE_NAME = "ftc-scout:theme";
export const THEME_COOKIE_AGE = 60 * 60 * 24 * 365 * 10;

// message bar settings
export const MESSAGE_BAR_COOKIE_NAME = "ftc-scout:message-bar";
export const MESSAGE_BAR_COOKIE_AGE = 60 * 60 * 24 * 7;
export const SHOW_MESSAGE_BAR = false;
export const MESSAGE_BAR_TEXT = "Message Bar Text";
export const MESSAGE_BAR_LINK = "https://example.com";

// sidear contents
export const EMAIL = "contact@ftcscout.org";
export const DISCORD = "https://discord.gg/XTZhD9RnKa";
export const STATUS = "https://uptime.9021007.xyz/status/ftcscout";
export const GITHUB = "https://github.com/ftc-scout/ftc-scout";
