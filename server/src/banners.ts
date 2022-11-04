import { createCanvas, registerFont, Image } from "canvas";
import { resolve } from "path";
import { Team } from "./db/entities/Team";
import { Response } from "express";
import { readFile } from "fs/promises";
import { DATA_SOURCE } from "./db/data-source";
import { Event } from "./db/entities/Event";
import { DateTime } from "luxon";
import { TeamEventParticipation2022 } from "./db/entities/team-event-participation/TeamEventParticipation2022";
import { MatchScores2022 } from "./db/entities/MatchScores2022";

export async function teamBanner(teamNumber: number, res: Response) {
    let teamData = await Team.findOneBy({ number: teamNumber });

    if (teamData == null) {
        res.sendFile(resolve("src/res/banner.png"));
    } else {
        let maxOpr =
            (
                await DATA_SOURCE.getRepository(TeamEventParticipation2022)
                    .createQueryBuilder("tep")
                    .leftJoin("event", "e", 'e.code = tep."eventCode"', { teamNumber })
                    .where('tep."teamNumber" = :teamNumber')
                    .andWhere("NOT e.remote")
                    .orderBy('tep."oprTotalpoints"', "DESC")
                    .limit(1)
                    .getOne()
            )?.opr.totalPoints ?? null;

        let maxOprStr = maxOpr != null ? Math.round(maxOpr * 100) / 100 + "" : "N/A";

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

        ctx.fillText(teamData!.number + "", 80, 270);
        ctx.fillText(maxOprStr, 80, 380);
        ctx.fillText(teamData!.rookieYear + "", 330, 380);
        var size = 45;
        while (ctx.measureText(teamData!.name).width > 800) {
            size -= 1;
            ctx.font = `${size}pt InterB`;
        }
        ctx.fillText(teamData!.name, 330, 270);

        ctx.font = "24pt InterSB";
        ctx.fillText("Top OPR", 80, 320);
        ctx.fillText("Rookie Year", 330, 320);
        ctx.fillText("Team Number", 80, 205);
        ctx.fillText("Team Name", 330, 205);

        img.createPNGStream().pipe(res);
    }
}

export async function eventBanner(season: number, code: string, res: Response) {
    let eventData = await Event.findOneBy({ season, code });

    if (eventData == null) {
        res.sendFile(resolve("src/res/banner.png"));
    } else {
        let topScore =
            (
                await DATA_SOURCE.getRepository(MatchScores2022)
                    .createQueryBuilder("s")
                    .where('s."eventCode" = :code', { code })
                    .orderBy('s."totalPoints"', "DESC")
                    .limit(1)
                    .getOne()
            )?.totalPoints ?? null;

        let winningTeam =
            (
                await DATA_SOURCE.getRepository(TeamEventParticipation2022)
                    .createQueryBuilder("tep")
                    .where('tep."eventCode" = :code', { code })
                    .andWhere("tep.rp IS NOT NULL")
                    .orderBy("tep.rp", "DESC")
                    .limit(1)
                    .getOne()
            )?.teamNumber ?? null;

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

        let drawLeft = topScore != null || winningTeam != null;
        let rightX = drawLeft ? 360 : 80;

        if (drawLeft) {
            ctx.fillText(winningTeam == null ? "N/A" : winningTeam + "", 80, 270);
            ctx.fillText(topScore == null ? "N/A" : topScore + "", 80, 380);
        }

        let dateStr = DateTime.fromSQL(eventData.start as string, {
            zone: eventData.timezone ?? undefined,
        }).toLocaleString({ day: "numeric", month: "long", year: "numeric" });
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
}
