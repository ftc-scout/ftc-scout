declare namespace NodeJS {
    export interface ProcessEnv {
        // interaction
        DATABASE_URL: string;
        FTC_API_KEY: string;
        PORT: string;

        // switches
        LOGGING: string;
        SYNC: string;
        CACHE_REQ: string;

        // Secrets
        FRONTEND_CODE: string;
    }
}
