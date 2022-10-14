export function keyPathName(pathName: string): string {
    if (pathName.startsWith("/events")) {
        return pathName.replace(/\/(matches|rankings|insights|awards|teams)$/, "");
    } else {
        return pathName;
    }
}
