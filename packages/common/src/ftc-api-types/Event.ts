export interface EventFtcApi {
    eventId: string;
    code: string | null;
    divisionCode: string | null;
    name: string | null;
    remote: boolean;
    hybrid: boolean;
    fieldCount: number;
    published: boolean;
    type: string | null;
    typeName: string | null;
    regionCode: string | null;
    leagueCode: string | null;
    districtCode: string | null;
    venue: string | null;
    address: string | null;
    city: string | null;
    stateprov: string | null;
    country: string | null;
    website: string | null;
    liveStreamUrl: string | null;
    webcasts: string[] | null;
    timezone: string | null;
    dateStart: string;
    dateEnd: string;
}
