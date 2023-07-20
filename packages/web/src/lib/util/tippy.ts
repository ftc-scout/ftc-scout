import type { FullMatchFragment } from "../graphql/generated/graphql-operations";
import { prettyPrintFullTimeString } from "../printers/time";

export const HIDDEN_TIP = {
    content: "",
    maxWidth: 0,
    arrow: false,
};

export function matchTimeTip(
    match: FullMatchFragment | undefined,
    timeZone: string,
    theme: "light" | "dark"
) {
    if (match == undefined) return HIDDEN_TIP;
    return match.scores && match.actualStartTime
        ? {
              content: `Played ${prettyPrintFullTimeString(match.actualStartTime, timeZone)}`,
              theme,
          }
        : HIDDEN_TIP;
}
