import { Region } from "$lib/graphql/generated/graphql-operations";

export const REGION_NAMES = {
    AU: "Australia",
    BR: "Brazil",
    CAAB: "Alberta",
    CABC: "British Columbia",
    CAON: "Ontario",
    CAQC: "Québec",
    CMPZ2: "FIRST Championship - Zone 2", // TODO include this?
    CN: "China",
    CY: "Cyprus",
    EG: "Egypt",
    GB: "United Kingdom",
    IL: "Israel",
    IN: "India",
    JM: "Jamaica",
    KZ: "Kazakhstan",
    LY: "Libya",
    MX: "Mexico",
    NG: "Nigeria",
    NL: "Netherlands",
    ONADOD: "Military and Diplomatic",
    QA: "Qatar",
    RO: "Romania",
    RU: "Russia",
    TH: "Thailand",
    TW: "Chinese Taipei",
    USAK: "Alaska",
    USAL: "Alabama",
    USAR: "Arkansas",
    USARL: "Adventist Robotics League",
    USAZ: "Arizona",
    USCALA: "California - Los Angeles",
    USCANO: "California - Northern",
    USCASD: "California - San Diego",
    USCHS: "Chesapeake",
    USCO: "Colorado",
    USCT: "Connecticut",
    USDE: "Delaware",
    USFL: "Florida",
    USGA: "Georgia",
    USHI: "Hawaii",
    USIA: "Iowa",
    USID: "Idaho",
    USIL: "Illinois",
    USIN: "Indiana",
    USKY: "Kentucky",
    USLA: "Louisiana",
    USMA: "Massachusets",
    USMI: "Michigan",
    USMN: "Minnesota",
    USMOKS: "Missouri & Kansas",
    USMS: "Mississippi",
    USMT: "Montana",
    USNC: "North Carolina",
    USND: "North Dakota",
    USNH: "New Hampshire",
    USNJ: "New Jersey",
    USNM: "New Mexico",
    USNV: "Nevada",
    USNYEX: "New York - Excelsior",
    USNYLI: "New York - Long Island",
    USNYNY: "New York - NYC",
    USOH: "Ohio",
    USOK: "Oklahoma",
    USOR: "Oregon",
    USPA: "Pennsylvania",
    USRI: "Rhode Island",
    USSC: "South Carolina",
    USTN: "Tennessee",
    USTXCE: "Texas - Central",
    USTXHO: "Texas - Houston",
    USTXNO: "Texas - North",
    USTXSO: "Texas - South",
    USTXWP: "Texas - West and Panhandle",
    USUT: "Utah",
    USVT: "Vermont",
    USWA: "Washington",
    USWI: "Wisconsin",
    USWY: "Wyoming",
    ZA: "South Africa",
};

export function regionToString(region: Region): string {
    switch (region) {
        case Region.All:
            return "All";
        case Region.North:
            return "North";
        case Region.South:
            return "South";
        case Region.International:
            return "International";
        default:
            return (<any>REGION_NAMES)[region.toString()];
    }
}

export function regionFromStr(str: string): Region | null {
    switch (str) {
        case "All":
            return Region.All;
        case "North":
            return Region.North;
        case "South":
            return Region.South;
        case "International":
            return Region.International;
        default:
            for (let [k, v] of Object.entries(REGION_NAMES)) {
                if (v == str) {
                    return k as Region;
                }
            }
    }

    return null;
}
