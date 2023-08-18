import { INTERNATIONAL_REGIONS, RegionOption } from "@ftc-scout/common";

const REGION_NAMES: Record<RegionOption, string> = {
    All: "All",

    UnitedStates: "United States",
    International: "International",

    // cspell:ignoreRegExp [A-Z\d]+:
    // cspell:ignore LAUSD, Québec
    USAK: "Alaska",
    USAL: "Alabama",
    USAR: "Arkansas",
    USAZ: "Arizona",
    USCA: "California",
    USCALA: "California - Los Angeles",
    USCALS: "California - LAUSD",
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
    USMD: "Maryland",
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
    USNY: "New York",
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
    USTX: "Texas",
    USTXCE: "Texas - Central",
    USTXHO: "Texas - Houston",
    USTXNO: "Texas - North",
    USTXSO: "Texas - South",
    USTXWP: "Texas - West & Panhandle",
    USUT: "Utah",
    USVA: "Virginia",
    USVT: "Vermont",
    USWA: "Washington",
    USWI: "Wisconsin",
    USWV: "West Virginia",
    USWY: "Wyoming",

    CAAB: "Alberta",
    CABC: "British Columbia",
    CAON: "Ontario",
    CAQC: "Québec",

    AU: "Australia",
    BR: "Brazil",
    CN: "China",
    CY: "Cyprus",
    DE: "Germany",
    EG: "Egypt",
    ES: "Spain",
    FR: "Franc",
    GB: "Great Britain",
    IL: "Israel",
    IN: "India",
    JM: "Jamaica",
    KR: "South Korea",
    KZ: "Kazakhstan",
    LY: "Libya",
    MX: "Mexico",
    NG: "Nigeria",
    NL: "Netherlands",
    NZ: "New Zealand",
    QA: "Qatar",
    RO: "Romania",
    RU: "Russia",
    SA: "Saudi Arabia",
    TH: "Thailand",
    TW: "Taiwan",
    ZA: "South Africa",

    CMPIC: "Innovation Challenge",
    CMPZ2: "FIRST Championship",
    ONADOD: "Military & Diplomatic",
    USARL: "Adventist Robotics League",
    // cspell:enable
};

export function regionName(option: RegionOption): string {
    return REGION_NAMES[option];
}

export function regionMatches(option: RegionOption, code: string): boolean {
    switch (option) {
        case RegionOption.All:
            return true;
        case RegionOption.UnitedStates:
            return code.startsWith("US");
        case RegionOption.International:
            return (INTERNATIONAL_REGIONS as string[]).indexOf(code) != -1;
        case RegionOption.USCA:
        case RegionOption.USTX:
        case RegionOption.USNY:
            return code.startsWith(option);
        default:
            return option == code;
    }
}

export const REGION_GROUPS: RegionOption[][] = [
    [RegionOption.All, RegionOption.UnitedStates, RegionOption.International],

    // cspell:ignoreRegExp RegionOption\.[A-Z\d]+
    [
        RegionOption.USAK,
        RegionOption.USAL,
        RegionOption.USAR,
        RegionOption.USAZ,
        RegionOption.USCA,
        RegionOption.USCALA,
        RegionOption.USCALS,
        RegionOption.USCANO,
        RegionOption.USCASD,
        RegionOption.USCHS,
        RegionOption.USCO,
        RegionOption.USCT,
        RegionOption.USDE,
        RegionOption.USFL,
        RegionOption.USGA,
        RegionOption.USHI,
        RegionOption.USIA,
        RegionOption.USID,
        RegionOption.USIL,
        RegionOption.USIN,
        RegionOption.USKY,
        RegionOption.USLA,
        RegionOption.USMA,
        RegionOption.USMD,
        RegionOption.USMI,
        RegionOption.USMN,
        RegionOption.USMOKS,
        RegionOption.USMS,
        RegionOption.USMT,
        RegionOption.USNC,
        RegionOption.USND,
        RegionOption.USNH,
        RegionOption.USNJ,
        RegionOption.USNM,
        RegionOption.USNV,
        RegionOption.USNY,
        RegionOption.USNYEX,
        RegionOption.USNYLI,
        RegionOption.USNYNY,
        RegionOption.USOH,
        RegionOption.USOK,
        RegionOption.USOR,
        RegionOption.USPA,
        RegionOption.USRI,
        RegionOption.USSC,
        RegionOption.USTN,
        RegionOption.USTX,
        RegionOption.USTXCE,
        RegionOption.USTXHO,
        RegionOption.USTXNO,
        RegionOption.USTXSO,
        RegionOption.USTXWP,
        RegionOption.USUT,
        RegionOption.USVA,
        RegionOption.USVT,
        RegionOption.USWA,
        RegionOption.USWI,
        RegionOption.USWV,
        RegionOption.USWY,
    ],

    [RegionOption.CAAB, RegionOption.CABC, RegionOption.CAON, RegionOption.CAQC],

    INTERNATIONAL_REGIONS,

    [RegionOption.CMPIC, RegionOption.CMPZ2, RegionOption.ONADOD, RegionOption.USARL],
];
