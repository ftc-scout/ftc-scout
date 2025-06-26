import { env } from "$env/dynamic/public";
import { IS_DEV } from "$lib/constants";

export const GET = async () => {
    let s = IS_DEV ? "" : "s";
    const endpoint = `http${s}://${env.PUBLIC_SERVER_ORIGIN!}/sitemap.xml`;
    const res = await fetch(endpoint);
    const xml = await res.text();

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
};
