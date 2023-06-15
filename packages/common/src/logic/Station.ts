export const Station = {
    One: "1",
    Two: "2",
    NotOnField: "NotOnField",
    Solo: "Solo",
} as const;
export type Station = (typeof Station)[keyof typeof Station];
