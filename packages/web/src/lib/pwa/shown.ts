/** Keeps track of all answers on a page and handles slow data */

export type Reason = "slow" | "failed";

export type Kept = { at: number | null; reason: Reason };

export type Message =
    | { ftcscout: "kept"; url?: string; at?: number | null; reason?: Reason }
    | { ftcscout: "fresh"; url?: string }
    | { ftcscout: "update"; url?: string };

export class KeptAnswers {
    private shown = new Map<string, Kept & { page: number }>();
    /** Keeps track of the page, prevents the bottom bar from showing data of the previous page */
    private page = 0;
    navigated() {
        this.page++;
    }

    /** Returns true when page should reload data */
    receive(message: Message): boolean {
        for (let [url, kept] of this.shown) {
            if (kept.page < this.page) this.shown.delete(url);
        }
        let url = message.url ?? "";
        switch (message.ftcscout) {
            case "kept":
                this.shown.set(url, {
                    at: message.at ?? null,
                    reason: message.reason ?? "failed",
                    page: this.page,
                });
                return false;
            case "fresh":
                this.shown.delete(url);
                return false;
            case "update":
                return this.shown.delete(url);
        }
        return false;
    }

    summary(): Kept | null {
        let all = [...this.shown.values()];
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
