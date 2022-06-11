import "isomorphic-fetch";
import { FTC_API_KEY } from "../constants";

export async function makeRequest(
    url: string,
    params: Record<string, any> = {},
    sinceDate: Date | null
): Promise<any | null> {
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
    try {
        return await response.json();
    } catch {
        return null;
    }
}
