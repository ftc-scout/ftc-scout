export const RegionCode = {
    // cspell:disable
    AU: "AU",
    BR: "BR",
    CAAB: "CAAB",
    CABC: "CABC",
    CAON: "CAON",
    CAQC: "CAQC",
    CMPIC: "CMPIC",
    CMPZ2: "CMPZ2",
    CN: "CN",
    CY: "CY",
    DE: "DE",
    EG: "EG",
    ES: "ES",
    FR: "FR",
    GB: "GB",
    IL: "IL",
    IN: "IN",
    JM: "JM",
    KR: "KR",
    KZ: "KZ",
    LY: "LY",
    MX: "MX",
    NG: "NG",
    NL: "NL",
    NZ: "NZ",
    ONADOD: "ONADOD",
    QA: "QA",
    RO: "RO",
    RU: "RU",
    SA: "SA",
    TH: "TH",
    TW: "TW",
    USAK: "USAK",
    USAL: "USAL",
    USAR: "USAR",
    USARL: "USARL",
    USAZ: "USAZ",
    USCALA: "USCALA",
    USCALS: "USCALS",
    USCANO: "USCANO",
    USCASD: "USCASD",
    USCHS: "USCHS",
    USCO: "USCO",
    USCT: "USCT",
    USDE: "USDE",
    USFL: "USFL",
    USGA: "USGA",
    USHI: "USHI",
    USIA: "USIA",
    USID: "USID",
    USIL: "USIL",
    USIN: "USIN",
    USKY: "USKY",
    USLA: "USLA",
    USMA: "USMA",
    USMD: "USMD",
    USMI: "USMI",
    USMN: "USMN",
    USMOKS: "USMOKS",
    USMS: "USMS",
    USMT: "USMT",
    USNC: "USNC",
    USND: "USND",
    USNH: "USNH",
    USNJ: "USNJ",
    USNM: "USNM",
    USNV: "USNV",
    USNYEX: "USNYEX",
    USNYLI: "USNYLI",
    USNYNY: "USNYNY",
    USOH: "USOH",
    USOK: "USOK",
    USOR: "USOR",
    USPA: "USPA",
    USRI: "USRI",
    USSC: "USSC",
    USTN: "USTN",
    USTXCE: "USTXCE",
    USTXHO: "USTXHO",
    USTXNO: "USTXNO",
    USTXSO: "USTXSO",
    USTXWP: "USTXWP",
    USUT: "USUT",
    USVA: "USVA",
    USVT: "USVT",
    USWA: "USWA",
    USWI: "USWI",
    USWV: "USWV",
    USWY: "USWY",
    ZA: "ZA",
    // cspell:enable
} as const;
export type RegionCode = (typeof RegionCode)[keyof typeof RegionCode];

export const RegionOption = {
    All: "All",
    UnitedStates: "UnitedStates",
    International: "International",
    // cspell:ignore USCA, USNY, USTX
    USCA: "USCA",
    USNY: "USNY",
    USTX: "USTX",
    ...RegionCode,
} as const;
export type RegionOption = (typeof RegionOption)[keyof typeof RegionOption];

export function getRegionCodes(region: RegionOption): RegionCode[] {
    switch (region) {
        case RegionOption.All:
            return Object.values(RegionCode);
        case RegionOption.UnitedStates:
            return Object.values(RegionCode).filter((c) => c.startsWith("US"));
        case RegionOption.International:
            return INTERNATIONAL_REGIONS;
        case RegionOption.USCA:
        case RegionOption.USTX:
        case RegionOption.USNY:
            return Object.values(RegionCode).filter((c) => c.startsWith(region));
        default:
            return [region];
    }
}

export const INTERNATIONAL_REGIONS = [
    RegionOption.AU,
    RegionOption.BR,
    RegionOption.CN,
    RegionOption.CY,
    RegionOption.DE,
    RegionOption.EG,
    RegionOption.ES,
    RegionOption.FR,
    RegionOption.GB,
    RegionOption.IL,
    RegionOption.IN,
    RegionOption.JM,
    RegionOption.KR,
    RegionOption.KZ,
    RegionOption.LY,
    RegionOption.MX,
    RegionOption.NG,
    RegionOption.NL,
    RegionOption.NZ,
    RegionOption.QA,
    RegionOption.RO,
    RegionOption.RU,
    RegionOption.SA,
    RegionOption.TH,
    RegionOption.TW,
    RegionOption.ZA,
];
