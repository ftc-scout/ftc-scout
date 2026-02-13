export function match(param: string): boolean {
    return (
        param == "matches" ||
        param == "rankings" ||
        param == "league-rankings" ||
        param == "insights" ||
        param == "awards" ||
        param == "teams" ||
        param == "preview" ||
        param == "advancement"
    );
}
