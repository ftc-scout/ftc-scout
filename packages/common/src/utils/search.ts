function isSepChar(c: string | undefined): boolean {
    return c == " " || c == "-" || c == undefined;
}

function calcSkipWordMap(str: string): number[] {
    let map: number[] = [];

    let lastLoc = 0;
    let previousIsSep = false;

    for (let i = 1; i <= str.length; i++) {
        let isSep = isSepChar(str[str.length - i]);
        map[i] = lastLoc;
        if (previousIsSep && !isSep) lastLoc = i - 1;
        previousIsSep = isSep;
    }

    return map;
}

function calcShortestDistance(
    haystack: string,
    needle: string,
    distMatrix?: number[],
    pathMatrix?: number[]
): number {
    const notAllowedCost = Infinity;
    const baseDeleteCost = 50;
    const baseMoveCost = 10;
    const prefixCost = 1;

    if (needle == "") return 0;
    if (haystack == "") return needle.length * baseDeleteCost;

    let hLen = haystack.length;
    let nLen = needle.length;
    // matrix[hi + ni * hLen]

    distMatrix ??= [];
    pathMatrix ??= [];

    for (let hi = 0; hi <= hLen; hi++) distMatrix[hi] = 0;
    for (let ni = 0; ni <= nLen; ni++) distMatrix[ni * hLen] = ni * baseDeleteCost;

    let skipWordMap = calcSkipWordMap(haystack);

    for (let hi = 1; hi <= hLen; hi++) {
        for (let ni = 1; ni <= nLen; ni++) {
            let nc = needle[nLen - ni];
            let hc = haystack[hLen - hi];

            // We don't pay to shift in the start of the string
            let shiftCost = ni == nLen ? 0 : baseMoveCost;
            // pay extra to cross a word boundary in only the haystack and not the needle
            shiftCost *= isSepChar(hc) && !isSepChar(nc) ? 3 : 1;

            let deleteNC = distMatrix[hi + (ni - 1) * hLen] + baseDeleteCost;
            let useNC = nc == hc ? distMatrix[hi - 1 + (ni - 1) * hLen] : notAllowedCost;
            let skipChar = distMatrix[hi - 1 + ni * hLen] + shiftCost;
            let skipWord =
                isSepChar(hc) || isSepChar(nc)
                    ? distMatrix[skipWordMap[hi] + ni * hLen]
                    : notAllowedCost;
            let prefix =
                hc == nc && skipWordMap[hi] > 1
                    ? distMatrix[skipWordMap[hi] - 1 + (ni - 1) * hLen] + prefixCost
                    : notAllowedCost;

            // Set to min value
            let min = Math.min(deleteNC, useNC, skipChar, skipWord, prefix);
            distMatrix[hi + ni * hLen] = min;
            if (deleteNC == min) {
                // Delete
                pathMatrix[hi + ni * hLen] = hi + (ni - 1) * hLen;
            } else if (useNC == min) {
                // Use
                pathMatrix[hi + ni * hLen] = hi - 1 + (ni - 1) * hLen;
            } else if (skipChar == min) {
                // Skip char
                pathMatrix[hi + ni * hLen] = hi - 1 + ni * hLen;
            } else if (skipWord == min) {
                // Skip word
                pathMatrix[hi + ni * hLen] = skipWordMap[hi] + ni * hLen;
            } else {
                // Skip prefix
                pathMatrix[hi + ni * hLen] = skipWordMap[hi] - 1 + (ni - 1) * hLen;
            }
        }
    }

    return distMatrix[hLen + nLen * hLen];
}

function calcHighlights(pathMatrix: number[], hLen: number, nLen: number): number[] {
    if (isNaN(hLen) || isNaN(nLen)) return [];

    let hi = hLen;
    let ni = nLen;
    let positions: number[] = [];

    while (hi != 0 && ni != 0) {
        let next = pathMatrix[hi + ni * hLen];
        let nHi = next % hLen;
        let nNi = Math.floor(next / hLen);

        if (nHi <= hi - 1 && nNi == ni - 1) positions.push(hLen - hi);
        if (hi == nHi && ni == nNi) return positions;

        hi = nHi;
        ni = nNi;
    }

    return positions;
}

export interface FuzzyResult<T> {
    document: T;
    distance: number;
    highlights: number[];
}

export function getFuzzyDistance(
    haystack: string,
    needle: string,
    distMatrix?: number[],
    pathMatrix?: number[]
): FuzzyResult<string> {
    haystack = haystack.toLowerCase().trim();
    needle = needle.toLowerCase().trim();

    pathMatrix ??= [];

    let distance = calcShortestDistance(haystack, needle, distMatrix, pathMatrix);
    let highlights = calcHighlights(pathMatrix, haystack.length, needle.length);

    return { document: haystack, distance, highlights };
}

function insert<T>(results: FuzzyResult<T>[], newR: FuzzyResult<T>) {
    let low = 0;
    let high = results.length - 1;

    while (low < high) {
        let mid = Math.floor((low + high) / 2);
        if (newR.distance > results[mid].distance) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    results.splice(low, 0, newR);
}

export function fuzzySearch<T>(
    documents: T[],
    needle: string,
    maxResults?: number,
    key?: keyof T,
    sort: boolean = false
): FuzzyResult<T>[] {
    if (needle == "") {
        return documents.map((document) => ({ document, distance: 0, highlights: [] }));
    }

    let distMatrix: number[] = [];
    let pathMatrix: number[] = [];

    maxResults ??= Infinity;

    let scoreCutoff = Infinity;
    let sortedResults: FuzzyResult<T>[] = [];

    for (let i = 0; i < documents.length; i++) {
        let haystack = key ? documents[i][key] : documents[i];
        let res = getFuzzyDistance(haystack + "", needle, distMatrix, pathMatrix);

        let dist = res.distance;
        let newCutoff = Math.min(dist * 2, 250);
        if (newCutoff < scoreCutoff) {
            scoreCutoff = newCutoff;
            sortedResults = sortedResults.filter((r) => r.distance < scoreCutoff);
        }

        let lastDist = sortedResults[sortedResults.length - 1]?.distance ?? Infinity;

        if (dist > scoreCutoff) continue;
        if (dist > lastDist && sortedResults.length < maxResults) continue;

        let documentRes = { ...res, document: documents[i] };
        if (sort) {
            insert(sortedResults, documentRes);
        } else {
            sortedResults.push(documentRes);
        }
    }

    return sortedResults;
}

export function highlight(
    str: string,
    highlights: number[],
    start: string = "<b>",
    end: string = "</b>"
): string {
    if (highlights.length == 0) return str;

    let newStr = "";
    let highlightsPos = 0;
    let inHighlight = false;

    for (let i = 0; i < str.length; i++) {
        let newInHighlight = highlights[highlightsPos] == i;
        if (newInHighlight) highlightsPos++;

        if (!inHighlight && newInHighlight) newStr += start;
        if (inHighlight && !newInHighlight) newStr += end;
        newStr += str[i];

        inHighlight = newInHighlight;
    }
    if (inHighlight) newStr += end;

    return newStr;
}
