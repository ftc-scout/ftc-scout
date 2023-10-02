export const Station = {
    One: "One",
    Two: "Two",
    NotOnField: "NotOnField",
    Solo: "Solo",
} as const;
export type Station = (typeof Station)[keyof typeof Station];
