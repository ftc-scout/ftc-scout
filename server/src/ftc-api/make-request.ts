import "isomorphic-fetch";
import { FTC_API_KEY } from "../constants";

let lastRequest = 0;

export async function makeRequest(
    url: string,
    params: Record<string, any> = {},
    sinceDate: Date | null
): Promise<any | null> {
    // Rate limit ourselves to 5 requests per second
    while (true) {
        let now = Date.now();

        if (lastRequest > now - 200) {
            await new Promise((r) => setTimeout(r, lastRequest + 200 - now));
        } else {
            break;
        }
    }

    lastRequest = Date.now();

    const paramsString = Object.entries(params)
        .map((x) => `${x[0]}=${x[1]}`)
        .join("&");
    let response = await fetch(
        `http://ftc-api.firstinspires.org/v2.0/${url}?${paramsString}`,
        {
            headers: {
                Authorization: `Basic ${FTC_API_KEY}`,
                "FMS-OnlyModifiedSince":
                    sinceDate?.toLocaleDateString("en-US") ?? "",
            },
        }
    );

    let text = (await response.text()).trim();
    if (text == "") {
        return null;
    } else {
        return JSON.parse(text);
    }
}
