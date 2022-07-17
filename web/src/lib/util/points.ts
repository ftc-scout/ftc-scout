import type { AutoNavigation2021, BarcodeElement2021, EndgamePark2021 } from "../graphql/generated/graphql-operations";

export function autoNavigationPoints2021(nav: AutoNavigation2021): number {
    switch (nav) {
        case "COMPLETELY_IN_STORAGE":
            return 6;
        case "COMPLETELY_IN_WAREHOUSE":
            return 3;
        case "IN_STORAGE":
            return 10;
        case "IN_WAREHOUSE":
            return 5;
        default:
            return 0;
    }
}

export function autoBonusPoints2021(bonus: boolean, barcode: BarcodeElement2021): number {
    if (bonus) {
        switch (barcode) {
            case "TSE":
                return 20;
            default:
                return 10;
        }
    } else {
        return 0;
    }
}

export function endgameParkPoints2021(park: EndgamePark2021): number {
    switch (park) {
        case "COMPLETELY_IN_WAREHOUSE":
            return 6;
        case "IN_WAREHOUSE":
            return 3;
        default:
            return 0;
    }
}
