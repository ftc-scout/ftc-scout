import * as core from "express-serve-static-core";
import { resolve } from "path";
import { Team } from "./db/entities/Team";
import { TeamEventParticipation } from "./db/entities/dyn/team-event-participation";
import { CURRENT_SEASON, DESCRIPTORS, Season } from "@ftc-scout/common";
import { Event } from "./db/entities/Event";
import { createCanvas, registerFont, Image } from "canvas";
import { readFile } from "fs/promises";
import { MatchScore } from "./db/entities/dyn/match-score";
import { DateTime } from "luxon";

function sendBanner(res: core.Response) {
    res.sendFile(resolve("src/res/banner.png"));
}

export function setupBannerRoutes(app: core.Express) {
    app.get("/banners/teams/:team_num", async (req, res) => {
        if (+req.params.team_num) {
            teamBanner(+req.params.team_num, res);
        } else {
            sendBanner(res);
        }
    });

    app.get("/banners/events/:season/:code", async (req, res) => {
        if (/^\d+$/.test(req.params.season)) {
            await eventBanner(+req.params.season as Season, req.params.code, res);
        } else {
            sendBanner(res);
        }
    });
}

async function teamBanner(number: number, res: core.Response) {
    let teamData = await Team.findOneBy({ number });
    if (!teamData) return sendBanner(res);

    let pensSub = DESCRIPTORS[CURRENT_SEASON].pensSubtract;
    let bestEvent = await TeamEventParticipation[CURRENT_SEASON].createQueryBuilder("tep")
        .leftJoin(Event, "e", "e.code = tep.event_code")
        .where("tep.team_number = :number", { number })
        .andWhere("NOT e.remote")
        .orderBy(pensSub ? "opr_total_points" : "opr_total_points_np", "DESC")
        .limit(1)
        .getOne();
    let bestOpr = bestEvent?.opr?.[pensSub ? "totalPoints" : "totalPointsNp"] ?? null;
    let bestOprStr = bestOpr != null ? Math.round(bestOpr * 100) / 100 + "" : "N/A";

    registerFont("src/res/Inter-SemiBold.ttf", { family: "InterSB" });
    registerFont("src/res/Inter-Bold.ttf", { family: "InterB" });
    var img = createCanvas(1200, 628);
    var ctx = img.getContext("2d");

    let waveBuffer = await readFile("src/res/wave.png");

    const image = new Image();
    image.onload = () => ctx.drawImage(image, 0, 0);
    image.src = waveBuffer;

    ctx.fillStyle = "#000";
    ctx.font = "45pt InterB";

    ctx.fillText(teamData.number + "", 80, 270);
    ctx.fillText(bestOprStr, 80, 380);
    ctx.fillText(teamData.rookieYear + "", 330, 380);
    var size = 45;
    while (ctx.measureText(teamData.name).width > 800) {
        size -= 1;
        ctx.font = `${size}pt InterB`;
    }
    ctx.fillText(teamData.name, 330, 270);

    ctx.font = "24pt InterSB";
    ctx.fillText("Top OPR", 80, 320);
    ctx.fillText("Rookie Year", 330, 320);
    ctx.fillText("Team Number", 80, 205);
    ctx.fillText("Team Name", 330, 205);

    img.createPNGStream().pipe(res);
}

export async function eventBanner(season: Season, code: string, res: core.Response) {
    let eventData = await Event.findOneBy({ season, code });
    if (!eventData) return sendBanner(res);

    let bestMatch = await MatchScore[season]
        .createQueryBuilder("ms")
        .where("ms.event_code = :code", { code })
        .orderBy("ms.total_points", "DESC")
        .limit(1)
        .getOne();
    let bestScore = bestMatch?.totalPoints ?? null;

    let winningTeam = await TeamEventParticipation[season]
        .createQueryBuilder("tep")
        .where("tep.event_code = :code", { code })
        .andWhere("tep.rp IS NOT NULL")
        .orderBy("tep.rp", "DESC")
        .limit(1)
        .getOne();
    let winningTeamNum = winningTeam?.teamNumber ?? null;

    registerFont("src/res/Inter-SemiBold.ttf", { family: "InterSB" });
    registerFont("src/res/Inter-Bold.ttf", { family: "InterB" });
    var img = createCanvas(1200, 628);
    var ctx = img.getContext("2d");

    let waveBuffer = await readFile("src/res/wave.png");

    const image = new Image();
    image.onload = () => ctx.drawImage(image, 0, 0);
    image.src = waveBuffer;

    ctx.fillStyle = "#000";
    ctx.font = "45pt InterB";

    let drawLeft = bestScore != null || winningTeamNum != null;
    let rightX = drawLeft ? 360 : 80;

    if (drawLeft) {
        ctx.fillText(winningTeamNum == null ? "N/A" : winningTeamNum + "", 80, 270);
        ctx.fillText(bestScore == null ? "N/A" : bestScore + "", 80, 380);
    }

    let dateStr = DateTime.fromISO(eventData.start as any, {
        zone: eventData.timezone ?? undefined,
    }).toLocaleString({
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    ctx.fillText(dateStr, rightX, 380);
    var size = 45;
    while (ctx.measureText(eventData.name).width > 1200 - rightX) {
        size -= 1;
        ctx.font = `${size}pt InterB`;
    }
    ctx.fillText(eventData.name, rightX, 270);

    ctx.font = "24pt InterSB";
    if (drawLeft) {
        ctx.fillText("Top Score", 80, 320);
        ctx.fillText("Top Qualifier", 80, 205);
    }
    ctx.fillText("Date", rightX, 320);
    ctx.fillText("Event", rightX, 205);

    img.createPNGStream().pipe(res);
}
