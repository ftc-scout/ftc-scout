import type { Express, Response } from "express";
import { Team } from "../db/entities/Team";
import { Event } from "../db/entities/Event";
import { ALL_SEASONS } from "@ftc-scout/common";

export function setupSiteMap(app: Express) {
    app.get("/sitemap.xml", sitemap);
}

async function sitemap(res: Response) {
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
    const urlsetHeader = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    const urlsetFooter = "</urlset>";
    const pre = "https://ftcscout.org";
    let urls = [];
    let xmls = [];

    let teams = await Team.find();
    let events = await Event.find();
    let seasons = await ALL_SEASONS;

    for (const team of teams) {
        urls.push(`/teams/${team.number}`);
    }

    for (const event of events) {
        urls.push(`/events/${event.season}/${event.code}`);
    }

    for (const season of seasons) {
        urls.push(`/records/${season}/teams`);
        urls.push(`/records/${season}/matches`);
        urls.push(`/events/${season}`);
    }

    urls.push("/about");
    urls.push("/api");
    urls.push("/blog");
    urls.push("/privacy");
    urls.push("/teams");
    urls.push("/");

    xmls = urls.map((url) => {
        return `  <url><loc>${pre}${url}</loc></url>\n`;
    });

    res.header("Content-Type", "application/xml");
    res.send(xmlHeader + urlsetHeader + xmls.join("") + urlsetFooter);
}
