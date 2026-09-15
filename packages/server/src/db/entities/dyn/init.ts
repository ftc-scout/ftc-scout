import { initMS } from "./match-score";
import { initTep } from "./team-event-participation";
import { initLeagueRanking } from "./league-ranking";

export function initDynamicEntities() {
    initMS();
    initTep();
    initLeagueRanking();
}
