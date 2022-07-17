import { registerEnumType } from "type-graphql";

export enum BarcodeElement2021 {
    DUCK = 0,
    TSE = 1,
}

export function barcodeElementFromApi(be: "DUCK" | "TEAM_SHIPPING_ELEMENT"): BarcodeElement2021 {
    return be == "DUCK" ? BarcodeElement2021.DUCK : BarcodeElement2021.TSE;
}

registerEnumType(BarcodeElement2021, {
    name: "BarcodeElement2021",
});
