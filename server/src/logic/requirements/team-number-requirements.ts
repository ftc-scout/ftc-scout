import { FieldError } from "src/graphql/objects/FieldError";
import { Team } from "../../db/entities/Team";

export async function checkTeamNumberRequirements(
    teamNumber: string
): Promise<FieldError[]> {
    let ret: FieldError[] = [];

    if (teamNumber === "") {
        return ret;
    }

    if (!/\d+/.test(teamNumber)) {
        ret.push({
            field: "teamNumber",
            message: "Your team number must be a number.",
        });
    } else if ((await Team.findBy({ number: +teamNumber })).length === 0) {
        ret.push({
            field: "teamNumber",
            message: "That team does not exist.",
        });
    }
    return ret;
}
