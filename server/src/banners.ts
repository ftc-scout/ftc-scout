import { createCanvas, registerFont, Image } from "canvas";
import { resolve } from "path";
import { Team } from "./db/entities/Team";
import { Response } from "express";
import { readFile } from "fs/promises";
import { TeamEventParticipation2021 } from "./db/entities/team-event-participation/TeamEventParticipation2021";

export async function teamBanner(teamNumber: number, res: Response) {
    let teamData = await Team.findOneBy({ number: teamNumber });

    if (teamData == null) {
        res.sendFile(resolve("src/res/banner.png"));
    } else {
        let maxOpr = Math.max(
            ...(await TeamEventParticipation2021.findBy({ teamNumber }))!.map((tep) => tep.opr.totalPoints)
        );
        maxOpr = Math.round(maxOpr * 100) / 100;
        let maxOprStr = isFinite(maxOpr) ? maxOpr + "" : "N/A";

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
