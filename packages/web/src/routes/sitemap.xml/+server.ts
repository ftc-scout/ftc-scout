import { PUBLIC_SERVER_ORIGIN } from "$env/static/public";

export const GET = async () => {
    const endpoint = `http://${PUBLIC_SERVER_ORIGIN}/sitemap.xml`;
    const res = await fetch(endpoint);
    const xml = await res.text();

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
};
