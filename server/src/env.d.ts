declare namespace NodeJS {
    export interface ProcessEnv {
        FTC_API_KEY: string;
        DATABASE_URL: string;
        WEB_URL: string;
        LOGGING: string;
        SESSION_SECRET: string;
        REDIS_URL: string;
        PORT: string;
    }
}
