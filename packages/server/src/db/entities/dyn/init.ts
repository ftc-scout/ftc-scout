import { initMS } from "./match-score";
import { initTep } from "./team-event-participation";

export function initDynamicEntities() {
    initMS();
    initTep();
}
