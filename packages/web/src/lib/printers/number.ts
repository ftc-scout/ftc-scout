export function prettyPrintOrdinal(num: number): string {
    if (num >= 11 && num <= 13) {
        return `${num}th`;
    }

    switch (num % 10) {
        case 1:
            return `${num}st`;
        case 2:
            return `${num}nd`;
        case 3:
            return `${num}rd`;
        default:
            return `${num}th`;
    }
}

export function prettyPrintFloat(num: number): string {
    return (Math.round(num * 100) / 100).toFixed(2);
}

export function prettyPrintInt(num: number): string {
    return num + "";
}
