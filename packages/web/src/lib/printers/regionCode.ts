export function prettyPrintRegionCode(code: string): string {
    if (code.startsWith("US") || code.startsWith("CA")) {
        return code.slice(2, 4);
    } else if (code == "CMPZ2") {
        return "TX";
    } else if (code == "ONADOD") {
        return "DD";
    } else {
        return code;
    }
}
