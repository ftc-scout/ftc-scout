import type { NextFunction, Request, Response } from "express";

// Forwards errors to express error handler (and error-handler.ts)
export function asyncHandler<Req extends Request = Request, Res extends Response = Response>(
    fn: (req: Req, res: Res) => Promise<unknown>
) {
    return (req: Req, res: Res, next: NextFunction) => {
        fn(req, res).catch(next);
    };
}
