import { matrix, inv, multiply, transpose } from "mathjs";

// Based on this guide for OPR calculation: https://blog.thebluealliance.com/2017/10/05/the-math-behind-opr-an-introduction/

export function calculateOPR(
    scores: { team1: number; team2: number; result: number }[]
): Record<number, number> {
    let allTeams = [...new Set(scores.flatMap((s) => [s.team1, s.team2]))];

    let allianceMatrix = matrix(
        scores.map((s) =>
            allTeams.map((t) => (t == s.team1 || t == s.team2 ? 1 : 0))
        ),
        "sparse"
    );
    let resultsMatrix = matrix(
        scores.map((s) => [s.result]),
        "sparse"
    );

    let allianceTranspose = transpose(allianceMatrix);
    let allianceTimesSelfTranspose = multiply(
        allianceTranspose,
        allianceMatrix
    );
    let allianceTransposeTimesResults = multiply(
        allianceTranspose,
        resultsMatrix
    );

    // TODO: Find a way to solve this without using the inverse
    let allianceInverse = inv(allianceTimesSelfTranspose);

    let solutions = multiply(allianceInverse, allianceTransposeTimesResults);

    let ret: Record<number, number> = {};
    for (let i = 0; i < allTeams.length; i++) {
        ret[allTeams[i]] = solutions.get([i, 0]);
    }
    return ret;
}
