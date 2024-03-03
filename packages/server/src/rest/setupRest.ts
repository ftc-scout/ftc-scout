import type { Express, Request, Response } from "express";
import { Team } from "../db/entities/Team";
import { TeamEventParticipation } from "../db/entities/dyn/team-event-participation";
import {
    ALL_SEASONS,
    CURRENT_SEASON,
    EventTypeOption,
    RegionOption,
    Season,
    fuzzySearch,
    getEventTypes,
    getRegionCodes,
} from "@ftc-scout/common";
import { Award } from "../db/entities/Award";
import { TeamMatchParticipation } from "../db/entities/TeamMatchParticipation";
import { Event } from "../db/entities/Event";
import { DateTime } from "luxon";
import { Match } from "../db/entities/Match";
import { DATA_SOURCE } from "../db/data-source";
import { frontendMSFromDB } from "../graphql/dyn/match-score";
import { FindOptionsWhere } from "typeorm";
import { getQuickStats } from "../graphql/resolvers/Team";

const pre = "/rest/v1/";

function isSeason(season: number): season is Season {
    return (ALL_SEASONS as readonly number[]).indexOf(season) != -1;
}

function isRegion(region: string): region is RegionOption {
    return !!(RegionOption as any)[region];
}

function isEventType(type: string): type is EventTypeOption {
    return !!(EventTypeOption as any)[type];
}

function isNumber(num: string) {
    return !Number.isNaN(+num);
}

function isDate(date: string): boolean {
    return !!new Date(date);
}

export function setupRest(app: Express) {
    app.get(pre + "teams/:number(\\d+)", teamByNumber);
    app.get(pre + "teams/:number(\\d+)/events/:season(\\d+)", teamEvents);
    app.get(pre + "teams/:number(\\d+)/awards", teamAwards);
    app.get(pre + "teams/:number(\\d+)/matches", teamMatches);
    app.get(pre + "teams/:number(\\d+)/quick-stats", teamQuickStats);
    app.get(pre + "teams/search", teamSearch);

    app.get(pre + "events/:season(\\d+)/:code", eventByCode);
    app.get(pre + "events/:season(\\d+)/:code/matches", eventMatches);
    app.get(pre + "events/:season(\\d+)/:code/awards", eventAwards);
    app.get(pre + "events/:season(\\d+)/:code/teams", eventTeams);
    app.get(pre + "events/search/:season(\\d+)", eventSearch);
}

async function teamByNumber(req: Request<{ number: string }>, res: Response) {
    let number = +req.params.number;
    let team = await Team.findOneBy({ number });

    if (!team) {
        res.status(404).send(`No team with number ${number}.`);
        return;
    }

    res.send(team);
}

async function getTeps(
    season: Season,
    findOptions: FindOptionsWhere<TeamEventParticipation>
): Promise<any> {
    let participations = await TeamEventParticipation[season].findBy(findOptions);
    let results = [];

    for (let p of participations) {
        if (p.hasStats) {
            results.push({
                season: p.season,
                eventCode: p.eventCode,
                teamNumber: p.teamNumber,
                isRemote: p.isRemote,
                stats: {
                    rank: p.rank,
                    rp: p.rp,
                    tb1: p.tb1,
                    ...("tb2" in p ? { tb2: p.tb2 } : {}),
                    ...("wins" in p ? { wins: p.wins } : {}),
                    ...("losses" in p ? { losses: p.losses } : {}),
                    ...("ties" in p ? { ties: p.ties } : {}),
                    ...("dqs" in p ? { dqs: p.dqs } : {}),
                    qualMatchesPlayed: p.qualMatchesPlayed,
                    tot: p.tot,
                    avg: p.avg,
                    opr: p.opr,
                    min: p.min,
                    max: p.max,
                    dev: p.dev,
                },
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
            });
        } else {
            results.push({
                season: p.season,
                eventCode: p.eventCode,
                teamNumber: p.teamNumber,
                isRemote: p.isRemote,
                stats: null,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
            });
        }
    }

    return results;
}

async function teamEvents(req: Request<{ number: string; season: string }>, res: Response) {
    let teamNumber = +req.params.number;
    let season = +req.params.season;

    if (!isSeason(season)) {
        res.status(400).send(`Invalid season ${season}.`);
        return;
    }

    res.send(await getTeps(season, { teamNumber }));
}

async function teamAwards(req: Request<{ number: string }>, res: Response) {
    let teamNumber = +req.params.number;
    let season = req.query.season as string | undefined;
    let eventCode = req.query.eventCode as string | undefined;

    if (season && !isSeason(+season)) {
        res.status(400).send(`Invalid season ${season}.`);
        return;
    }

    let awards = await Award.findBy({
        teamNumber,
        ...(season ? { season: +season as Season } : {}),
        ...(eventCode ? { eventCode } : {}),
    });

    res.send(awards);
}

async function teamMatches(req: Request<{ number: string }>, res: Response) {
    let teamNumber = +req.params.number;
    let season = req.query.season as string | undefined;
    let eventCode = req.query.eventCode as string | undefined;

    if (season && !isSeason(+season)) {
        res.status(400).send(`Invalid season ${season}.`);
        return;
    }

    let tmps = await TeamMatchParticipation.findBy({
        teamNumber,
        ...(season ? { season: +season as Season } : {}),
        ...(eventCode ? { eventCode } : {}),
    });

    res.send(tmps);
}

async function teamQuickStats(req: Request<{ number: string }>, res: Response) {
    let teamNumber = +req.params.number;
    let season = +((req.query.season as string | undefined) ?? CURRENT_SEASON);
    let region = req.query.region as RegionOption | undefined;

    if (!isSeason(season)) {
        res.status(400).send(`Invalid season ${season}.`);
        return;
    }

    if (region && !isRegion(region)) {
        res.status(400).send(`Invalid region ${region}.`);
        return;
    }

    let stats = await getQuickStats(teamNumber, season, region ?? null);

    if (!stats) {
        res.status(404).send(`Team ${teamNumber} has no stats for ${season}.`);
    } else {
        res.send(stats);
    }
}

async function teamSearch(req: Request, res: Response) {
    let region = req.query.region as RegionOption | undefined;
    let limit = req.query.limit as string | undefined;
    let searchText = req.query.searchText as string | undefined;

    if (region && !isRegion(region)) {
        res.status(400).send(`Invalid region ${region}.`);
        return;
    }

    if (limit && !isNumber(limit)) {
        res.status(400).send(`Invalid limit ${limit}.`);
        return;
    }

    let q = DATA_SOURCE.getRepository(Team).createQueryBuilder("t").distinctOn(["number"]);

    if (region && region != RegionOption.All) {
        q.leftJoin(TeamMatchParticipation, "m", "t.number = m.team_number")
            .leftJoin(Event, "e", "e.season = m.season AND e.code = m.event_code")
            .andWhere("e.region_code IN (:...regions)", {
                regions: getRegionCodes(region),
            });
    }

    if (limit && (!searchText || searchText.trim() == "")) {
        q.limit(+limit);
    }

    let entities = await q.getMany();

    if (searchText) searchText = searchText.trim();
    if (searchText && searchText != "") {
        if (searchText.match(/^\d+$/)) {
            entities = entities
                .filter((e) => (e.number + "").startsWith(searchText!))
                .sort((a, b) => a.number - b.number);
        } else {
            let res = fuzzySearch(
                entities,
                searchText,
                limit != undefined ? +limit : undefined,
                "name",
                true
            );
            entities = res.map((d) => d.document);
        }
    }

    res.send(entities);
}

async function eventByCode(req: Request<{ season: string; code: string }>, res: Response) {
    let season = +req.params.season;
    let code = req.params.code;

    if (!isSeason(season)) {
        res.status(400).send(`Invalid season ${season}.`);
        return;
    }

    let event = await Event.findOneBy({ season, code });

    if (!event) {
        res.status(404).send(`No event in season ${season} with code ${code}.`);
        return;
    }

    res.send({
        ...event,
        started: DateTime.fromISO(event.start as any, { zone: event.timezone }) < DateTime.now(),
        ongoing:
            DateTime.fromISO(event.start as any, { zone: event.timezone }) < DateTime.now() &&
            DateTime.now() < DateTime.fromISO(event.end as any, { zone: event.timezone }),
        finished: DateTime.fromISO(event.end as any, { zone: event.timezone }) < DateTime.now(),
    });
}

async function eventMatches(req: Request<{ season: string; code: string }>, res: Response) {
    let season = +req.params.season;
    let code = req.params.code;

    if (!isSeason(season)) {
        res.status(400).send(`Invalid season ${season}.`);
        return;
    }

    let event = await Event.findOneBy({ season, code });

    if (!event) {
        res.status(404).send(`No event in season ${season} with code ${code}.`);
        return;
    }

    let matches = await DATA_SOURCE.getRepository(Match)
        .createQueryBuilder("m")
        .where("m.event_season = :season", { season })
        .andWhere("m.event_code = :code", { code })
        .leftJoinAndMapMany(
            "m.scores",
            `match_score_${season}`,
            "ms",
            "m.event_season = ms.season AND m.event_code = ms.event_code AND m.id = ms.match_id"
        )
        .leftJoinAndMapMany(
            "m.teams",
            "team_match_participation",
            "tmp",
            "m.event_season = tmp.season AND m.event_code = tmp.event_code AND m.id = tmp.match_id"
        )
        .getMany();

    for (let m of matches) {
        (m as any).scores = frontendMSFromDB(m.scores);
        if (m.scores) (m as any).scores.__typename = undefined;
    }

    res.send(matches);
}

async function eventAwards(req: Request<{ season: string; code: string }>, res: Response) {
    let season = +req.params.season;
    let eventCode = req.params.code;

    if (!isSeason(season)) {
        res.status(400).send(`Invalid season ${season}.`);
        return;
    }

    let awards = await Award.findBy({ season, eventCode });

    res.send(awards);
}

async function eventTeams(req: Request<{ season: string; code: string }>, res: Response) {
    let season = +req.params.season;
    let eventCode = req.params.code;

    if (!isSeason(season)) {
        res.status(400).send(`Invalid season ${season}.`);
        return;
    }

    res.send(await getTeps(season, { eventCode }));
}

async function eventSearch(req: Request<{ season: string }>, res: Response) {
    let season = +req.params.season;

    if (!isSeason(season)) {
        res.status(400).send(`Invalid season ${season}.`);
        return;
    }

    let region = req.query.region as RegionOption | undefined;
    let type = req.query.type as EventTypeOption | undefined;
    let hasMatches = req.query.hasMatches;
    let start = req.query.start as string;
    let end = req.query.start as string;
    let limit = req.query.limit as string | undefined;
    let searchText = req.query.searchText as string | undefined;

    if (region && !isRegion(region)) {
        res.status(400).send(`Invalid region ${region}.`);
        return;
    }

    if (type && !isEventType(type)) {
        res.status(400).send(`Invalid event type ${type}.`);
        return;
    }

    if (hasMatches != undefined && hasMatches != "true" && hasMatches != "false") {
        res.status(400).send(`Invalid boolean ${hasMatches} for hasMatches.`);
        return;
    }

    if (start && !isDate(start)) {
        res.status(400).send(`Invalid start date ${start}.`);
        return;
    }

    if (end && !isDate(end)) {
        res.status(400).send(`Invalid end date ${end}.`);
        return;
    }

    if (limit && !isNumber(limit)) {
        res.status(400).send(`Invalid limit ${limit}.`);
        return;
    }

    let q = DATA_SOURCE.getRepository(Event)
        .createQueryBuilder("e")
        .distinctOn(["code"])
        .addSelect("coalesce(m.has_been_played, false)", "has_matches")
        .where("season = :season", { season });

    if (region && region != RegionOption.All) {
        q.andWhere("region_code IN (:...regions)", { regions: getRegionCodes(region) });
    }

    if (type && type != EventTypeOption.All) {
        q.andWhere("type IN (:...types)", { types: getEventTypes(type) });
    }

    if (start) {
        let s = new Date(start);
        q.andWhere('"start" >= :start', { start: s.toISOString().split("T")[0] });
    }

    if (end) {
        let e = new Date(end);
        q.andWhere('"end" <= :end', { end: e.toISOString().split("T")[0] });
    }

    if (limit && (!searchText || searchText.trim() == "")) {
        q.limit(+limit);
    }

    let { entities, raw } = await q
        .leftJoin(Match, "m", "e.season = m.event_season AND e.code = m.event_code")
        .getRawAndEntities();

    for (let i = 0; i < entities.length; i++) {
        (entities[i] as any).hasMatches = raw[i].has_matches;
    }

    if (hasMatches != null) {
        entities = entities.filter((e) => (e as any).hasMatches == (hasMatches == "true"));
    }

    if (searchText && searchText.trim() != "") {
        let res = fuzzySearch(
            entities,
            searchText,
            limit != undefined ? +limit : undefined,
            "name",
            true
        );
        entities = res.map((d) => d.document);
    }

    res.send(entities);
}
