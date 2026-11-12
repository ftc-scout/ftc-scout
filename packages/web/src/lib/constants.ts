export const IS_PROD = process.env.NODE_ENV === "production";
export const IS_DEV = !IS_PROD;

export const UNREACHABLE = "The server can't be reached";

/** Whether an error is the API not answering (a network failure), not a bug in the page. */
export function isUnreachable(error: unknown): boolean {
    if (error == null || typeof error != "object") return false;
    if ("networkError" in error && error.networkError) return true;
    return error instanceof TypeError && /fetch|network/i.test(error.message);
}

// dark mode settings
export const THEME_COOKIE_NAME = "ftc-scout:theme";
export const THEME_COOKIE_AGE = 60 * 60 * 24 * 356 * 10;

// alert bar settings
export const ALERT_COOKIE_NAME = "ftc-scout:alert-dismissed";
export const ALERT_COOKIE_AGE = 60 * 60 * 24 * 7;

// sidear contents
export const EMAIL = "contact@ftcscout.org";
export const DISCORD = "https://discord.gg/XTZhD9RnKa";
export const STATUS = "https://uptime.9021007.xyz/status/ftcscout";
export const GITHUB = "https://github.com/ftc-scout/ftc-scout";
export const DONATIONS = "https://hcb.hackclub.com/donations/start/ftcscout";
