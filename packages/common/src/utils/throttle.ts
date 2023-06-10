import { Mutex } from "async-mutex";

/**
 * Wraps fn while ensuring the minimum time between executions is timeout. No calls are dropped.
 *
 * @param fn The function to wrap.
 * @param timeout The minimum time between invocations
 */
export const throttled = <T extends Array<any>, U>(
    fn: (...args: T) => Promise<U>,
    timeout: number
) => {
    const requestMutex = new Mutex();

    return async (...args: T): Promise<U> => {
        const release = await requestMutex.acquire();
        const start = Date.now();

        try {
            return fn(...args);
        } finally {
            const elapsed = Date.now() - start;
            setTimeout(release, timeout - elapsed);
        }
    };
};
