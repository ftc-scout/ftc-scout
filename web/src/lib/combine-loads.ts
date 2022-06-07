import type { Load } from "@sveltejs/kit";

export function combineLoads(...loadFunctions: Load[]): Load {
    return async function (eventIn) {
        let event = Object.assign({}, eventIn);

        let collectedResponse = {
            stuff: event.stuff,
        };
        for (const f of loadFunctions) {
            let newRes = await f(event);
            event.stuff = {
                ...event.stuff,
                ...newRes.stuff,
            };
            mergeOutputs(collectedResponse, newRes);
        }
        return collectedResponse;
    };
}

function mergeOutputs(current: any, newRes: any): any {
    for (const [k, v] of Object.entries(newRes)) {
        if (typeof current[k] == "object") {
            Object.assign(current[k], v);
        } else {
            current[k] = v;
        }
    }
}
