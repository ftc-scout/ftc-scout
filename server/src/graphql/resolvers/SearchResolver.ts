import fuzzysort from "fuzzysort";
import { Arg, Field, ObjectType, Query, Resolver } from "type-graphql";
import { MINUTE_MS } from "../../constants";
import { Team } from "../../db/entities/Team";
import { Event } from "../../db/entities/Event";
import levenshtein from "fast-levenshtein";

@ObjectType()
class SearchResults {
    constructor(searchText: string, teams: TeamSearchResult[], events: EventSearchResult[]) {
        this.searchText = searchText;
        this.teams = teams;
        this.events = events;
    }

    @Field(() => String)
    searchText: string;

    @Field(() => [TeamSearchResult])
    teams: TeamSearchResult[];

    @Field(() => [EventSearchResult])
    events: EventSearchResult[];
}

@ObjectType()
class TeamSearchResult {
    constructor(searchText: string, team: Team, highlighted: string) {
        this.searchText = searchText;
        this.team = team;
        this.highlighted = highlighted;
    }

    @Field(() => String)
    searchText: string;

    @Field(() => Team)
    team: Team;

    @Field(() => String)
    highlighted: string;
}

@ObjectType()
class EventSearchResult {
    constructor(searchText: string, event: Event, highlighted: string) {
        this.searchText = searchText;
        this.event = event;
        this.highlighted = highlighted;
    }

    @Field(() => String)
    searchText: string;

    @Field(() => Event)
    event: Event;

    @Field(() => String)
    highlighted: string;
}

const NUM_RESULTS = 5;

@Resolver()
export class SearchResolver {
    @Query(() => SearchResults)
    async search(@Arg("searchText", () => String) searchText: string): Promise<SearchResults> {
        if (searchText.length > 100 || searchText == "") return new SearchResults(searchText, [], []);

        await updateCache();

        // fuzzysort results have to contain all the text in the search (but can be be jumbled).
        // Therefore we check this first.
        let teamResults = teamResultsStrict(searchText);
        let eventResults = eventResultsStrict(searchText);

        // If fuzzysort didn't find anything it is likely that the user made a misspelling.
        // Therefore we will try a fuzzy method which is more lenient.
        if (teamResults.length == 0) teamResults = teamResultsLax(searchText);
        if (eventResults.length == 0) eventResults = eventResultsLax(searchText);

        return new SearchResults(searchText, teamResults, eventResults);
    }
}

const CACHE_UPDATE_TIME = MINUTE_MS * 5;

async function updateCache() {
    let now = new Date();
    if (new Date().getTime() > lastCacheUpdate.getTime() + CACHE_UPDATE_TIME) {
        let teams = await Team.find();

        teams.forEach((t) => (t.number = ("" + t.number) as any));
        cachedTeams = teams;

        let events = await Event.find();
        cachedEvents = events;

        lastCacheUpdate = now;
    }
}

let lastCacheUpdate = new Date(0);
let cachedTeams = [] as Team[];
let cachedEvents = [] as Event[];

function getHighlightTextTeams(res: Fuzzysort.KeysResult<Team>): string {
    let numPart = fuzzysort.highlight(res[0]) ?? "" + res.obj.number;
    let namePart = fuzzysort.highlight(res[1]) ?? res.obj.name;
    return `${numPart} ${namePart}`;
}

function teamResultsStrict(searchText: string): TeamSearchResult[] {
    let results = fuzzysort.go(searchText, cachedTeams, {
        limit: NUM_RESULTS,
        threshold: -10000,
        keys: ["number", "name"],
    });
    return results.map((r) => new TeamSearchResult(searchText, r.obj, getHighlightTextTeams(r)));
}

function teamResultsLax(searchText: string): TeamSearchResult[] {
    let names = cachedTeams.map((t) => t.name);

    let distances = names.map((t) => {
        let bestDistance = levenshtein.get(t, searchText, { useCollator: true });
        for (let i = 0; i <= t.length - searchText.length; i++) {
            let searchSlice = t.slice(i, i + searchText.length);
            bestDistance = Math.min(bestDistance, levenshtein.get(searchSlice, searchText, { useCollator: true }));
        }
        return bestDistance;
    });

    let top = [...distances.entries()]
        .sort((a, b) => a[1] - b[1])
        .filter(([_, d]) => d < searchText.length / 3 + 1)
        .slice(0, NUM_RESULTS);

    return top.map(([i, _]) => {
        let team: Team = cachedTeams[i];
        return new TeamSearchResult(searchText, team, `${team.number} ${team.name}`);
    });
}

function getHighlightTextEvents(res: Fuzzysort.KeysResult<Event>): string {
    let codePart = fuzzysort.highlight(res[0]);
    let namePart = fuzzysort.highlight(res[1]) ?? res.obj.name;
    if (codePart) {
        return `${codePart} (${namePart})`;
    } else {
        return `${namePart}`;
    }
}

function eventResultsStrict(searchText: string): EventSearchResult[] {
    let results = fuzzysort.go(searchText, cachedEvents, {
        limit: NUM_RESULTS,
        threshold: -10000,
        keys: ["code", "name"],
    });
    return results.map((r) => new EventSearchResult(searchText, r.obj, getHighlightTextEvents(r)));
}

function eventResultsLax(searchText: string): EventSearchResult[] {
    let names = cachedEvents.map((e) => e.name);

    let distances = names.map((t) => {
        let bestDistance = levenshtein.get(t, searchText, { useCollator: true });
        for (let i = 0; i <= t.length - searchText.length; i++) {
            let searchSlice = t.slice(i, i + searchText.length);
            bestDistance = Math.min(bestDistance, levenshtein.get(searchSlice, searchText, { useCollator: true }));
        }
        return bestDistance;
    });

    let top = [...distances.entries()]
        .sort((a, b) => a[1] - b[1])
        .filter(([_, d]) => d < searchText.length / 3 + 1)
        .slice(0, NUM_RESULTS);

    return top.map(([i, _]) => {
        let event: Event = cachedEvents[i];
        return new EventSearchResult(searchText, event, `${event.name}`);
    });
}
