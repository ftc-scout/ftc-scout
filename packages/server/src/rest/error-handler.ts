import type { ErrorRequestHandler } from "express";

// Check if it is postgres input error (400) or server error (500)
function postgresSqlState(err: unknown): string | undefined {
    let e = err as { code?: unknown; driverError?: { code?: unknown } } | null | undefined;
    let code = e?.code ?? e?.driverError?.code;
    return typeof code === "string" ? code : undefined;
}

// Catch errors sent from asyncHandler
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
    console.error(`[REST] ${req.method} ${req.originalUrl} failed:`, err);

    if (res.headersSent) return;

    if (postgresSqlState(err)?.startsWith("22")) {
        res.status(400).send("Invalid request.");
    } else {
        res.status(500).send("Internal server error.");
    }
};
