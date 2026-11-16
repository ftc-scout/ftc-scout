/** Keeps track of all answers on a page and handles slow data */

export type Reason = "slow" | "failed";

export type Kept = { at: number | null; reason: Reason };

export type Message =
    | { ftcscout: "kept"; url?: string; at?: number | null; reason?: Reason }
    | { ftcscout: "fresh"; url?: string }
    | { ftcscout: "update"; url?: string };

export type Asked = { operationName: string; variables: Record<string, unknown> };

export function askedOf(url: string): Asked | null {
    try {
        let params = new URL(url).searchParams;
        let operationName = params.get("operationName");
        if (!operationName) return null;
        let variables = JSON.parse(params.get("variables") ?? "{}") ?? {};
        return { operationName, variables };
    } catch {
        return null;
    }
}

function stable(value: unknown): string | undefined {
    return JSON.stringify(value, (_, v) =>
        v && typeof v == "object" && !Array.isArray(v)
            ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)))
            : v
    );
}

export function sameAsked(address: Asked, asked: Asked): boolean {
    if (address.operationName != asked.operationName) return false;
    return Object.entries(address.variables).every(
        ([name, value]) => stable(value) == stable(asked.variables[name])
    );
}

const MAX_KEPT = 100;

export class KeptAnswers {
    private kept = new Map<string, Kept & { updated: boolean }>();

    /** Keeps track of queries on the page */
    constructor(private shown: (url: string) => boolean) {}

    /** Returns true when page should reload data */
    receive(message: Message): boolean {
        let url = message.url ?? "";
        switch (message.ftcscout) {
            case "kept":
                this.kept.delete(url);
                this.kept.set(url, {
                    at: message.at ?? null,
                    reason: message.reason ?? "failed",
                    updated: false,
                });
                for (let old of [...this.kept.keys()].slice(0, -MAX_KEPT)) this.kept.delete(old);
                return false;
            case "fresh":
                this.kept.delete(url);
                return false;
            case "update": {
                let copy = this.kept.get(url);
                if (!copy) return false;
                if (this.shown(url)) return true;
                // Preloaded: load again once its page is opened
                copy.updated = true;
                return false;
            }
        }
        return false;
    }

    shownChanged(): boolean {
        let again = false;
        for (let [url, copy] of this.kept) {
            if (copy.updated && this.shown(url)) {
                copy.updated = false;
                again = true;
            }
        }
        return again;
    }

    summary(): Kept | null {
        let all = [...this.kept].filter(([url]) => this.shown(url)).map(([, copy]) => copy);
        if (!all.length) return null;
        let times = all.map((k) => k.at).filter((at): at is number => at != null);
        return {
            at: times.length == all.length ? Math.min(...times) : null,
            reason: all.some((k) => k.reason == "failed") ? "failed" : "slow",
        };
    }
}

export function keptWhen(at: number, now: Date, locale?: string): string {
    let then = new Date(at);
    let time: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" };
    if (then.toDateString() == now.toDateString()) return then.toLocaleTimeString(locale, time);
    return then.toLocaleString(locale, { day: "numeric", month: "short", ...time });
}

/** For OfflineNotice.svelte */
export function keptLine(
    kept: Kept | null,
    offline: boolean,
    unreachable: string,
    now: Date,
    locale?: string
): string | null {
    if (!kept && !offline) return null;
    let what =
        kept?.at != null
            ? `showing data from ${keptWhen(kept.at, now, locale)}`
            : "showing saved data";
    if (offline) return `Offline: ${what}`;
    if (kept!.reason == "failed") return `${unreachable}: ${what}`;
    return `Slow connection: ${what} until the latest arrives`;
}
