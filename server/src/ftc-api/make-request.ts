import "isomorphic-fetch";
import { FTC_API_KEY } from "../constants";

export async function makeRequest(
    url: string,
    params: Record<string, any> = {}
) {
    const paramsString = Object.entries(params)
        .map((x) => `${x[0]}=${x[1]}`)
        .join("&");
    let response = await fetch(
        `http://ftc-api.firstinspires.org/v2.0/${url}?${paramsString}`,
        {
            headers: {
                Authorization: `Basic ${FTC_API_KEY}`,
            },
        }
    );
    return await response.json();
}
