import { Scores2021RemoteFtcApi } from "../../../ftc-api-types/match-scores/MatchScores2021Remote";
import {
    AllianceScores2021TradFtcApi,
    AutoNavigation2021FtcApi,
} from "../../../ftc-api-types/match-scores/MatchScores2021Trad";
import { nOf } from "../../../utils/format/n-of";
import { Season } from "../../Season";
import { Station } from "../../Station";
import { Descriptor, DescriptorColumn } from "../descriptor";
import { BoolDTy, EnumDTy, Int16DTy } from "../types";

export const BarcodeElement2021 = {
    Duck: "Duck",
    TSE: "TSE",
} as const;
export type BarcodeElement2021 = (typeof BarcodeElement2021)[keyof typeof BarcodeElement2021];
const BarcodeElement2021DTy = EnumDTy(
    BarcodeElement2021,
    "BarcodeElement2021",
    "barcode_element_2021_enum"
);

function barcodeElementFromApi(api: "DUCK" | "TEAM_SHIPPING_ELEMENT"): BarcodeElement2021 {
    switch (api) {
        case "DUCK":
            return BarcodeElement2021.Duck;
        case "TEAM_SHIPPING_ELEMENT":
            return BarcodeElement2021.TSE;
    }
}

export const AutoNav2021 = {
    None: "None",
    InStorage: "InStorage",
    CompletelyInStorage: "CompletelyInStorage",
    InWarehouse: "InWarehouse",
    CompletelyInWarehouse: "CompletelyInWarehouse",
} as const;
export type AutoNav2021 = (typeof AutoNav2021)[keyof typeof AutoNav2021];
const AutoNav2021DTy = EnumDTy(AutoNav2021, "AutoNav2021", "auto_nav_2021_enum");

function autoNav2021FromApi(api: AutoNavigation2021FtcApi): AutoNav2021 {
    switch (api) {
        case "NONE":
            return AutoNav2021.None;
        case "IN_STORAGE":
            return AutoNav2021.InStorage;
        case "COMPLETELY_IN_STORAGE":
            return AutoNav2021.CompletelyInStorage;
        case "IN_WAREHOUSE":
            return AutoNav2021.InWarehouse;
        case "COMPLETELY_IN_WAREHOUSE":
            return AutoNav2021.CompletelyInWarehouse;
    }
}

export function autoNav2021Points(nav: AutoNav2021 | null): number {
    if (nav == null) return 0;

    switch (nav) {
        case "None":
            return 0;
        case "InStorage":
            return 3;
        case "CompletelyInStorage":
            return 6;
        case "InWarehouse":
            return 5;
        case "CompletelyInWarehouse":
            return 10;
    }
}

function formatAutoNav2021(nav: AutoNav2021): string {
    switch (nav) {
        case "None":
            return "No Park";
        case "InStorage":
            return "Partially in Storage";
        case "CompletelyInStorage":
            return "Fully in Storage";
        case "InWarehouse":
            return "Partially in Warehouse";
        case "CompletelyInWarehouse":
            return "Fully in Warehouse";
    }
}

export const EgPark2021 = {
    None: "None",
    InWarehouse: "InWarehouse",
    CompletelyInWarehouse: "CompletelyInWarehouse",
} as const;
export type EgPark2021 = (typeof EgPark2021)[keyof typeof EgPark2021];
const EgPark2021DTy = EnumDTy(EgPark2021, "EgPark2021", "eg_park_2021_enum");

function egPark2021FromApi(api: "NONE" | "IN_WAREHOUSE" | "COMPLETELY_IN_WAREHOUSE"): EgPark2021 {
    switch (api) {
        case "NONE":
            return EgPark2021.None;
        case "IN_WAREHOUSE":
            return EgPark2021.InWarehouse;
        case "COMPLETELY_IN_WAREHOUSE":
            return EgPark2021.CompletelyInWarehouse;
    }
}

export function egPark2021Points(park: EgPark2021 | null): number {
    if (park == null) return 0;

    switch (park) {
        case "None":
            return 0;
        case "InWarehouse":
            return 3;
        case "CompletelyInWarehouse":
            return 6;
    }
}

function formatEgPark2021(park: EgPark2021): string {
    switch (park) {
        case "None":
            return "No Park";
        case "InWarehouse":
            return "Partially in Warehouse";
        case "CompletelyInWarehouse":
            return "Fully in Warehouse";
    }
}

export function autoBonusPoints2021(bonus: boolean, barcode: BarcodeElement2021): number {
    if (bonus) {
        return barcode == BarcodeElement2021.Duck ? 10 : 20;
    } else {
        return 0;
    }
}

function formatAutoBonusPoints2021(bonus: boolean, barcode: BarcodeElement2021): string {
    let item = barcode == BarcodeElement2021.Duck ? "Duck" : "TSE";

    if (bonus) {
        return `${item} Bonus`;
    } else {
        return `No Bonus ${item}`;
    }
}

type Api = AllianceScores2021TradFtcApi | Scores2021RemoteFtcApi;

export const Descriptor2021 = new Descriptor({
    season: Season.FreightFrenzy,
    seasonName: "Freight Frenzy",
    hasRemote: true,
    hasEndgame: true,
    pensSubtract: true,
    rankings: {
        rp: "TotalPoints",
        tb: "AutoEndgameTot",
    },
    firstDate: new Date("2021-09-17"),
    lastDate: new Date("2022-09-23"),
    kickoff: new Date("2021-09-18"),
})
    .addColumn(
        new DescriptorColumn({ name: "barcodeElement1" })
            .addMatchScore({
                remoteApiName: "barcodeElement",
                fromApi: (api: Api) =>
                    barcodeElementFromApi(
                        "barcodeElement1" in api ? api.barcodeElement1 : api.barcodeElement
                    ),
                dataTy: BarcodeElement2021DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "barcodeElement2", tradOnly: true })
            .addMatchScore({
                fromApi: (api: Api) =>
                    "barcodeElement2" in api ? barcodeElementFromApi(api.barcodeElement2) : null,
                dataTy: BarcodeElement2021DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoCarousel" })
            .addMatchScore({ fromApi: (api: Api) => api.carousel, dataTy: BoolDTy })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoNav1" })
            .addMatchScore({
                apiName: "autoNav2021_1",
                remoteApiName: "autoNav2021",
                fromApi: (api: Api) =>
                    autoNav2021FromApi(
                        "autoNavigated1" in api ? api.autoNavigated1 : api.autoNavigated
                    ),
                dataTy: AutoNav2021DTy,
            })
            .addScoreModal({
                displayName: "Robot 1",
                columnPrefix: "Auto Nav 1",
                fullName: "Robot 1 Auto Navigation Points",
                getValue: (ms) => autoNav2021Points(ms.autoNav2021_1),
                getTitle: (ms) => formatAutoNav2021(ms.autoNav2021_1),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoNav2", tradOnly: true })
            .addMatchScore({
                apiName: "autoNav2021_2",
                fromApi: (api: Api) =>
                    "autoNavigated2" in api ? autoNav2021FromApi(api.autoNavigated2) : null,
                dataTy: AutoNav2021DTy,
            })
            .addScoreModal({
                displayName: "Robot 2",
                columnPrefix: "Auto Nav 2",
                fullName: "Robot 2 Auto Navigation Points",
                getValue: (ms) => autoNav2021Points(ms.autoNav2021_2),
                getTitle: (ms) => formatAutoNav2021(ms.autoNav2021_2),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoBonus1" })
            .addMatchScore({
                remoteApiName: "autoBonus",
                fromApi: (api: Api) => ("autoBonus1" in api ? api.autoBonus1 : api.autoBonus),
                dataTy: BoolDTy,
            })
            .addScoreModal({
                displayName: "Robot 1",
                columnPrefix: "Bonus 1",
                fullName: "Robot 1 Auto Bonus Points",
                getValue: (ms) => autoBonusPoints2021(ms.autoBonus1, ms.barcodeElement1),
                getTitle: (ms) => formatAutoBonusPoints2021(ms.autoBonus1, ms.barcodeElement1),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoBonus2", tradOnly: true })
            .addMatchScore({
                fromApi: (api: Api) => ("autoBonus2" in api ? api.autoBonus2 : null),
                dataTy: BoolDTy,
            })
            .addScoreModal({
                displayName: "Robot 2",
                columnPrefix: "Bonus 2",
                fullName: "Robot 2 Auto Bonus Points",
                getValue: (ms) => autoBonusPoints2021(ms.autoBonus2, ms.barcodeElement2),
                getTitle: (ms) => formatAutoBonusPoints2021(ms.autoBonus2, ms.barcodeElement2),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoStorageFreight" }).addMatchScore({
            fromApi: (api: Api) => api.autoStorageFreight,
            dataTy: Int16DTy,
        })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoFreight1" })
            .addMatchScore({ fromApi: (api: Api) => api.autoFreight1, dataTy: Int16DTy })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoFreight2" })
            .addMatchScore({
                fromApi: (api: Api) => api.autoFreight2,
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoFreight3" })
            .addMatchScore({ fromApi: (api: Api) => api.autoFreight3, dataTy: Int16DTy })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcStorageFreight" })
            .addMatchScore({
                fromApi: (api: Api) => api.driverControlledStorageFreight,
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcFreight1" })
            .addMatchScore({
                fromApi: (api: Api) => api.driverControlledFreight1,
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcFreight2" })
            .addMatchScore({
                fromApi: (api: Api) => api.driverControlledFreight2,
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcFreight3" })
            .addMatchScore({
                fromApi: (api: Api) => api.driverControlledFreight3,
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "sharedFreight", tradOnly: true })
            .addMatchScore({
                fromApi: (api: Api) => ("sharedFreight" in api ? api.sharedFreight : null),
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "egDucks" })
            .addMatchScore({ fromApi: (api: Api) => api.endgameDelivered, dataTy: Int16DTy })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "allianceBalanced" })
            .addMatchScore({ fromApi: (api: Api) => api.allianceBalanced, dataTy: BoolDTy })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "sharedUnbalanced", tradOnly: true })
            .addMatchScore({
                fromApi: (api: Api) => ("sharedUnbalanced" in api ? api.sharedUnbalanced : null),
                dataTy: BoolDTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "egPark1" })
            .addMatchScore({
                remoteApiName: "egPark",
                fromApi: (api: Api) =>
                    egPark2021FromApi(
                        "endgameParked1" in api ? api.endgameParked1 : api.endgameParked
                    ),
                dataTy: EgPark2021DTy,
            })
            .addScoreModal({
                displayName: "Robot 1",
                remoteDisplayName: "Parking Points",
                columnPrefix: "Endgame Park 1",
                fullName: "Robot 1 Endgame Parking Points",
                getValue: (ms) => egPark2021Points(ms.egPark1),
                getTitle: (ms) => formatEgPark2021(ms.egPark1),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "egPark2", tradOnly: true })
            .addMatchScore({
                fromApi: (api: Api) =>
                    "endgameParked2" in api ? egPark2021FromApi(api.endgameParked2) : null,
                dataTy: EgPark2021DTy,
            })
            .addScoreModal({
                displayName: "Robot 2",
                columnPrefix: "Endgame Park 2",
                fullName: "Robot 2 Endgame Parking Points",
                getValue: (ms) => egPark2021Points(ms.egPark2),
                getTitle: (ms) => formatEgPark2021(ms.egPark2),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "capped" }).addMatchScore({
            fromApi: (api: Api) => api.capped,
            dataTy: Int16DTy,
        })
    )
    .addColumn(
        new DescriptorColumn({ name: "minorsCommitted" })
            .addMatchScore({ fromApi: (api: Api) => api.minorPenalties, dataTy: Int16DTy })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "majorsCommitted" })
            .addMatchScore({ fromApi: (api: Api) => api.majorPenalties, dataTy: Int16DTy })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoCarouselPoints" })
            .addMatchScore({ fromSelf: (self) => self.autoCarousel * 10, dataTy: Int16DTy })
            .addScoreModal({
                displayName: "Carousel Points",
                columnPrefix: "Auto Carousel",
                fullName: "Auto Carousel Points",
            })
            .addTep({ columnPrefix: "Auto Carousel", fullName: "Auto Carousel Points" })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoNavPoints" })
            .addMatchScore({
                fromSelf: (self) => {
                    if ("autoNav2021_1" in self) {
                        return (
                            autoNav2021Points(self.autoNav2021_1) +
                            autoNav2021Points(self.autoNav2021_2)
                        );
                    } else {
                        return autoNav2021Points(self.autoNav2021);
                    }
                },
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Navigation Points",
                columnPrefix: "Auto Nav",
                fullName: "Auto Navigation Points",
                getValue: (ms) =>
                    "autoNav2021" in ms
                        ? autoNav2021Points(ms.autoNav2021)
                        : autoNav2021Points(ms.autoNav2021_1) + autoNav2021Points(ms.autoNav2021_2),
                getTitle: (ms) => ("autoNav2021" in ms ? formatAutoNav2021(ms.autoNav2021) : ""),
            })
            .addTep({ columnPrefix: "Auto Nav", fullName: "Auto Navigation Points" })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoNavPointsIndividual" })
            .addTep({
                isIndividual: true,
                make: (ms, station) =>
                    station == Station.One
                        ? autoNav2021Points(ms.autoNav2021_1)
                        : station == Station.Solo
                        ? autoNav2021Points(ms.autoNav2021)
                        : autoNav2021Points(ms.autoNav2021_2),
                columnPrefix: "Auto Nav Individual",
                dialogName: "Individual",
                fullName: "Auto Navigation Points Individual",
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoFreightPoints" })
            .addMatchScore({
                fromSelf: (self) =>
                    self.autoStorageFreight * 2 +
                    (self.autoFreight1 + self.autoFreight2 + self.autoFreight3) * 6,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Freight Points",
                columnPrefix: "Auto Freight",
                fullName: "Auto Freight Points",
            })
            .addTep({ columnPrefix: "Auto Freight", fullName: "Auto Freight Points" })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoFreight1Points" })
            .addScoreModal({
                displayName: "Level 1",
                columnPrefix: "Auto Freight 1",
                fullName: "Level 1 Auto Freight Points",
                sql: (ms) => `(${ms}.autoFreight1 * 6)`,
                getValue: (ms) => ms.autoFreight1 * 6,
                getTitle: (ms) => nOf(ms.autoFreight1, "Freight", "Freight"),
            })
            .addTep({
                make: (ms) => ms.autoFreight1 * 6,
                columnPrefix: "Auto Freight 1",
                fullName: "Level 1 Auto Freight Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoFreight2Points" })
            .addScoreModal({
                displayName: "Level 2",
                columnPrefix: "Auto Freight 2",
                fullName: "Level 2 Auto Freight Points",
                sql: (ms) => `(${ms}.autoFreight2 * 6)`,
                getValue: (ms) => ms.autoFreight2 * 6,
                getTitle: (ms) => nOf(ms.autoFreight2, "Freight", "Freight"),
            })
            .addTep({
                make: (ms) => ms.autoFreight2 * 6,
                columnPrefix: "Auto Freight 2",
                fullName: "Level 2 Auto Freight Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoFreight3Points" })
            .addScoreModal({
                displayName: "Level 3",
                columnPrefix: "Auto Freight 3",
                fullName: "Level 3 Auto Freight Points",
                sql: (ms) => `(${ms}.autoFreight3 * 6)`,
                getValue: (ms) => ms.autoFreight3 * 6,
                getTitle: (ms) => nOf(ms.autoFreight3, "Freight", "Freight"),
            })
            .addTep({
                make: (ms) => ms.autoFreight3 * 6,
                columnPrefix: "Auto Freight 3",
                fullName: "Level 3 Auto Freight Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoFreightStoragePoints" })
            .addScoreModal({
                displayName: "Storage",
                columnPrefix: "Auto Storage",
                fullName: "Auto Storage Points",
                sql: (ms) => `(${ms}.autoStorageFreight * 2)`,
                getValue: (ms) => ms.autoStorageFreight * 2,
                getTitle: (ms) => nOf(ms.autoStorageFreight, "Freight", "Freight"),
            })
            .addTep({
                make: (ms) => ms.autoStorageFreight * 2,
                columnPrefix: "Auto Storage",
                fullName: "Auto Storage Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoBonusPoints" })
            .addMatchScore({
                fromSelf: (self) => {
                    if ("autoBonus1" in self) {
                        return (
                            autoBonusPoints2021(self.autoBonus1, self.barcodeElement1) +
                            autoBonusPoints2021(self.autoBonus2, self.barcodeElement2)
                        );
                    } else {
                        return autoBonusPoints2021(self.autoBonus, self.barcodeElement);
                    }
                },
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Bonus Points",
                columnPrefix: "Bonus",
                fullName: "Auto Bonus Points",
                getTitle: (ms) =>
                    "autoBonus" in ms
                        ? formatAutoBonusPoints2021(ms.autoBonus, ms.barcodeElement)
                        : "",
            })
            .addTep({ columnPrefix: "Bonus", fullName: "Auto Bonus Points" })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoBonusPointsIndividual" })
            .addTep({
                isIndividual: true,
                make: (ms, station) =>
                    station == Station.Solo
                        ? autoBonusPoints2021(ms.autoBonus, ms.barcodeElement)
                        : station == Station.One
                        ? autoBonusPoints2021(ms.autoBonus1, ms.barcodeElement1)
                        : autoBonusPoints2021(ms.autoBonus2, ms.barcodeElement2),
                columnPrefix: "Bonus Individual",
                dialogName: "Individual",
                fullName: "Auto Bonus Points Individual",
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcAllianceHubPoints" })
            .addMatchScore({
                fromSelf: (self) => self.dcFreight1 * 2 + self.dcFreight2 * 4 + self.dcFreight3 * 6,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Alliance Hub Points",
                columnPrefix: "Hub",
                fullName: "Alliance Hub Points",
            })
            .addTep({ columnPrefix: "Hub", fullName: "Alliance Hub Points" })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcFreight1Points" })
            .addScoreModal({
                displayName: "Level 1",
                columnPrefix: "Hub 1",
                fullName: "Level 1 Alliance Hub Points",
                sql: (ms) => `(${ms}.dcFreight1 * 2)`,
                getValue: (ms) => ms.dcFreight1 * 2,
                getTitle: (ms) => nOf(ms.dcFreight1, "Freight", "Freight"),
            })
            .addTep({
                make: (ms) => ms.dcFreight1 * 2,
                columnPrefix: "Hub 1",
                fullName: "Level 1 Alliance Hub Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcFreight2Points" })
            .addScoreModal({
                displayName: "Level 2",
                columnPrefix: "Hub 2",
                fullName: "Level 2 Alliance Hub Points",
                sql: (ms) => `(${ms}.dcFreight2 * 4)`,
                getValue: (ms) => ms.dcFreight2 * 4,
                getTitle: (ms) => nOf(ms.dcFreight2, "Freight", "Freight"),
            })
            .addTep({
                make: (ms) => ms.dcFreight2 * 4,
                columnPrefix: "Hub 2",
                fullName: "Level 2 Alliance Hub Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcFreight3Points" })
            .addScoreModal({
                displayName: "Level 3",
                columnPrefix: "Hub 3",
                fullName: "Level 3 Alliance Hub Points",
                sql: (ms) => `(${ms}.dcFreight3 * 6)`,
                getValue: (ms) => ms.dcFreight3 * 6,
                getTitle: (ms) => nOf(ms.dcFreight3, "Freight", "Freight"),
            })
            .addTep({
                make: (ms) => ms.dcFreight3 * 6,
                columnPrefix: "Hub 3",
                fullName: "Level 3 Alliance Hub Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcSharedHubPoints", tradOnly: true })
            .addMatchScore({
                fromSelf: (self) => ("sharedFreight" in self ? self.sharedFreight * 4 : 0),
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Shared Hub Points",
                columnPrefix: "Shared",
                fullName: "Shared Hub Points",
                getTitle: (ms) => nOf(ms.sharedFreight, "Freight", "Freight"),
            })
            .addTep({ columnPrefix: "Shared", fullName: "Shared Hub Points" })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcStoragePoints" })
            .addMatchScore({ fromSelf: (self) => self.dcStorageFreight, dataTy: Int16DTy })
            .addScoreModal({
                displayName: "Storage Points",
                columnPrefix: "Storage",
                fullName: "Teleop Storage Points",
                getTitle: (ms) => nOf(ms.dcStorageFreight, "Freight", "Freight"),
            })
            .addTep({ columnPrefix: "Storage", fullName: "Teleop Storage Points" })
    )
    .addColumn(
        new DescriptorColumn({ name: "egDuckPoints" })
            .addMatchScore({ fromSelf: (self) => self.egDucks * 6, dataTy: Int16DTy })
            .addScoreModal({
                displayName: "Delivery Points",
                columnPrefix: "Delivery",
                fullName: "Delivery Points",
                getTitle: (ms) => nOf(ms.egDucks, "Duck"),
            })
            .addTep({ columnPrefix: "Delivery", fullName: "Delivery Points" })
    )
    .addColumn(
        new DescriptorColumn({ name: "allianceBalancedPoints" })
            .addMatchScore({ fromSelf: (self) => self.allianceBalanced * 10, dataTy: Int16DTy })
            .addScoreModal({
                displayName: "Balanced Points",
                columnPrefix: "Hub Balanced",
                fullName: "Alliance Hub Balanced Points",
            })
            .addTep({ columnPrefix: "Hub Balanced", fullName: "Alliance Hub Balanced Points" })
    )
    .addColumn(
        new DescriptorColumn({ name: "sharedUnbalancedPoints", tradOnly: true })
            .addMatchScore({ fromSelf: (self) => self.sharedUnbalanced * 20, dataTy: Int16DTy })
            .addScoreModal({
                displayName: "Tipped Points",
                columnPrefix: "Shared Tipped",
                fullName: "Shared Hub Tipped Points",
            })
            .addTep({ columnPrefix: "Shared Tipped", fullName: "Shared Hub Tipped Points" })
    )
    .addColumn(
        new DescriptorColumn({ name: "egParkPoints" })
            .addMatchScore({
                fromSelf: (self) => {
                    if ("egPark1" in self) {
                        return egPark2021Points(self.egPark1) + egPark2021Points(self.egPark2);
                    } else {
                        return egPark2021Points(self.egPark);
                    }
                },
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Parking Points",
                columnPrefix: "Endgame Park",
                fullName: "Endgame Parking Points",
                getTitle: (ms) => ("egPark" in ms ? formatEgPark2021(ms.egPark) : ""),
            })
            .addTep({ columnPrefix: "Endgame Park", fullName: "Endgame Parking Points" })
    )
    .addColumn(
        new DescriptorColumn({ name: "egParkPointsIndividual" })
            .addTep({
                isIndividual: true,
                make: (ms, station) =>
                    station == Station.Solo
                        ? egPark2021Points(ms.egPark)
                        : station == Station.One
                        ? egPark2021Points(ms.egPark1)
                        : egPark2021Points(ms.egPark2),
                columnPrefix: "Endgame Park Individual",
                dialogName: "Individual",
                fullName: "Endgame Parking Points Individual",
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "cappingPoints" })
            .addMatchScore({ fromSelf: (self) => self.capped * 15, dataTy: Int16DTy })
            .addScoreModal({
                displayName: "Capping Points",
                columnPrefix: "Capping",
                fullName: "Capping Points",
                getTitle: (ms) => nOf(ms.capped, "TSE Capped", "TSEs Capped"),
            })
            .addTep({ columnPrefix: "Capping", fullName: "Capping Points" })
    )
    .addColumn(
        new DescriptorColumn({ name: "majorsCommittedPoints" })
            .addScoreModal({
                displayName: "Majors Points",
                columnPrefix: "Majors",
                fullName: "Major Penalty Points",
                sql: (ms) => `(${ms}.majorsCommitted * -30)`,
                getValue: (ms) => ms.majorsCommitted * -30,
                getTitle: (ms) => nOf(ms.majorsCommitted, "Major Committed", "Majors Committed"),
            })
            .addTep({
                make: (ms) => ms.majorsCommitted * -30,
                columnPrefix: "Majors",
                dialogName: "Majors",
                fullName: "Major Penalty Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "minorsCommittedPoints" })
            .addScoreModal({
                displayName: "Minors Points",
                columnPrefix: "Minors",
                fullName: "Minor Penalty Points",
                sql: (ms) => `(${ms}.minorsCommitted * -10)`,
                getValue: (ms) => ms.minorsCommitted * -10,
                getTitle: (ms) => nOf(ms.minorsCommitted, "Minor Committed", "Minors Committed"),
            })
            .addTep({
                make: (ms) => ms.minorsCommitted * -10,
                columnPrefix: "Minors",
                dialogName: "Minors",
                fullName: "Minor Penalty Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoPoints" })
            .addMatchScore({
                fromSelf: (self) =>
                    self.autoCarouselPoints +
                    self.autoNavPoints +
                    self.autoFreightPoints +
                    self.autoBonusPoints,
                dataTy: Int16DTy,
            })
            .addScoreModal({ displayName: "Auto", columnPrefix: "Auto", fullName: "Auto Points" })
            .addTep({ columnPrefix: "Auto", dialogName: "Auto Points", fullName: "Auto Points" })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcPoints" })
            .addMatchScore({
                fromSelf: (self) =>
                    self.dcAllianceHubPoints + self.dcStoragePoints + self.dcSharedHubPoints,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Driver-Controlled",
                columnPrefix: "Teleop",
                fullName: "Teleop Points",
            })
            .addTep({
                columnPrefix: "Teleop",
                dialogName: "Teleop Points",
                fullName: "Teleop Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "egPoints" })
            .addMatchScore({
                fromSelf: (self) =>
                    self.egDuckPoints +
                    self.allianceBalancedPoints +
                    self.sharedUnbalancedPoints +
                    self.egParkPoints +
                    self.cappingPoints,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Endgame",
                columnPrefix: "Endgame",
                fullName: "Endgame Points",
            })
            .addTep({
                columnPrefix: "Endgame",
                dialogName: "Endgame Points",
                fullName: "Endgame Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "penaltyPointsCommitted" })
            .addMatchScore({
                fromSelf: (self) => self.majorsCommitted * -30 + self.minorsCommitted * -10,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Penalties",
                columnPrefix: "Penalties",
                fullName: "Penalty Points",
            })
            .addTep({
                columnPrefix: "Penalties",
                dialogName: "Penalty Points",
                fullName: "Penalty Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "totalPointsNp" })
            .addMatchScore({
                fromSelf: (self) => self.autoPoints + self.dcPoints + self.egPoints,
                dataTy: Int16DTy,
            })
            .addTep({
                columnPrefix: "np",
                dialogName: "Total Points NP",
                fullName: "Total Points No Penalties",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "totalPoints" })
            .addMatchScore({
                fromSelf: (self) => Math.max(0, self.totalPointsNp + self.penaltyPointsCommitted),
                dataTy: Int16DTy,
            })
            .addTep({ columnPrefix: "", dialogName: "Total Points", fullName: "Total Points" })
    )

    .addTree(
        [
            { val: "totalPoints", children: [] },
            { val: "totalPointsNp", children: [] },
            {
                val: "autoPoints",
                children: [
                    {
                        val: "autoFreightPoints",
                        children: [
                            { val: "autoFreight1Points", children: [] },
                            { val: "autoFreight2Points", children: [] },
                            { val: "autoFreight3Points", children: [] },
                            { val: "autoFreightStoragePoints", children: [] },
                        ],
                    },
                    { val: "autoCarouselPoints", children: [] },
                    {
                        val: "autoNavPoints",
                        children: [
                            { val: "autoNav1", children: [] },
                            { val: "autoNav2", children: [] },
                            { val: "autoNavPointsIndividual", children: [] },
                        ],
                    },
                    {
                        val: "autoBonusPoints",
                        children: [
                            { val: "autoBonus1", children: [] },
                            { val: "autoBonus2", children: [] },
                            { val: "autoBonusPointsIndividual", children: [] },
                        ],
                    },
                ],
            },
            {
                val: "dcPoints",
                children: [
                    {
                        val: "dcAllianceHubPoints",
                        children: [
                            { val: "dcFreight1Points", children: [] },
                            { val: "dcFreight2Points", children: [] },
                            { val: "dcFreight3Points", children: [] },
                        ],
                    },
                    { val: "dcSharedHubPoints", children: [] },
                    { val: "dcStoragePoints", children: [] },
                ],
            },
            {
                val: "egPoints",
                children: [
                    { val: "egDuckPoints", children: [] },
                    { val: "cappingPoints", children: [] },
                    {
                        val: "egParkPoints",
                        children: [
                            { val: "egPark1", children: [] },
                            { val: "egPark2", children: [] },
                            { val: "egParkPointsIndividual", children: [] },
                        ],
                    },
                    { val: "allianceBalancedPoints", children: [] },
                    { val: "sharedUnbalancedPoints", children: [] },
                ],
            },
            {
                val: "penaltyPointsCommitted",
                children: [
                    { val: "majorsCommittedPoints", children: [] },
                    { val: "minorsCommittedPoints", children: [] },
                ],
            },
        ],

        [
            { val: "totalPoints", children: [] },
            { val: "totalPointsNp", children: [] },
            {
                val: "autoPoints",
                children: [
                    {
                        val: "autoFreightPoints",
                        children: [
                            { val: "autoFreight1Points", children: [] },
                            { val: "autoFreight2Points", children: [] },
                            { val: "autoFreight3Points", children: [] },
                            { val: "autoFreightStoragePoints", children: [] },
                        ],
                    },
                    { val: "autoCarouselPoints", children: [] },
                    { val: "autoNavPoints", children: [] },
                    { val: "autoBonusPoints", children: [] },
                ],
            },
            {
                val: "dcPoints",
                children: [
                    {
                        val: "dcAllianceHubPoints",
                        children: [
                            { val: "dcFreight1Points", children: [] },
                            { val: "dcFreight2Points", children: [] },
                            { val: "dcFreight3Points", children: [] },
                        ],
                    },
                    { val: "dcStoragePoints", children: [] },
                ],
            },
            {
                val: "egPoints",
                children: [
                    { val: "egDuckPoints", children: [] },
                    { val: "cappingPoints", children: [] },
                    { val: "egParkPoints", children: [] },
                    { val: "allianceBalancedPoints", children: [] },
                ],
            },
            {
                val: "penaltyPointsCommitted",
                children: [
                    { val: "majorsCommittedPoints", children: [] },
                    { val: "minorsCommittedPoints", children: [] },
                ],
            },
        ]
    )
    .addMatchInsightCols(
        [
            "autoFreightPoints",
            "dcFreight1Points",
            "dcSharedHubPoints",
            "sharedUnbalancedPoints",
            "egDuckPoints",
            "cappingPoints",
        ],
        ["autoFreightPoints", "dcFreight1Points", "egDuckPoints", "cappingPoints"]
    )
    .finish();
