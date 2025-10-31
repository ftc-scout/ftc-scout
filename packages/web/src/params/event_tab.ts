export function match(param: string): boolean {
    return (
        param == "matches" ||
        param == "rankings" ||
        param == "insights" ||
        param == "awards" ||
        param == "teams" ||
        param == "preview"
    );
}
