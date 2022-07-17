import { Matrix, SingularValueDecomposition } from "ml-matrix";

// Based on this guide for OPR calculation: https://blog.thebluealliance.com/2017/10/05/the-math-behind-opr-an-introduction/

export function calculateOPR(scores: { team1: number; team2: number; result: number }[]): Record<number, number> {
    if (scores.length == 0) return [];

    let allTeams = [...new Set(scores.flatMap((s) => [s.team1, s.team2]))];

    let allianceMatrix = new Matrix(scores.map((s) => allTeams.map((t) => (t == s.team1 || t == s.team2 ? 1 : 0))));
    let resultsVector = Matrix.columnVector(scores.map((s) => s.result));

    let oprs = new SingularValueDecomposition(allianceMatrix, {
        autoTranspose: true,
    }).solve(resultsVector);

    let ret: Record<number, number> = {};
    for (let i = 0; i < allTeams.length; i++) {
        ret[allTeams[i]] = oprs.get(i, 0);
    }
    return ret;
}
