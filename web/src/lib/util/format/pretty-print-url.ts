export function prettyPrintURL(url: string): string {
    const REGEX = /^https?:\/\/(.*?)\/?$/;

    let match = url.match(REGEX);
    if (match) {
        return match[1];
    } else {
        return url;
    }
}
