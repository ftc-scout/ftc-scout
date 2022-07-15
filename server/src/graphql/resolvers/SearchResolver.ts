import FuzzySet from "fuzzyset";
import fuzzysort from "fuzzysort";
import { Arg, Field, ObjectType, Query, Resolver } from "type-graphql";
import { MINUTE_MS } from "../../constants";
import { Team } from "../../db/entities/Team";

@ObjectType()
class TeamSearchResult {
    constructor(team: Team, highlighted: string) {
        this.team = team;
        this.highlighted = highlighted;
    }

    @Field(() => Team)
    team: Team;

    @Field(() => String, { nullable: true })
    highlighted: string;
}

const NUM_RESULTS = 5;

@Resolver()
export class SearchResolver {
    @Query(() => [TeamSearchResult])
    async search(
        @Arg("searchText", () => String) searchText: string
    ): Promise<TeamSearchResult[]> {
        if (searchText.length > 100) return [];

        await updateCache();

        // fuzzysort results have to contain all the text in the search (but can be be jumbled).
        // Therefore we check this first.
        let results = resultsStrict(searchText);

        if (results.length == 0) {
            // If fuzzysort didn't find anything it is likely that the user made a misspelling.
            // Therefore we will try fuzzyset which is more lenient.
            results = resultsLax(searchText);
        }
        return results;
    }
}

const CACHE_UPDATE_TIME = MINUTE_MS * 5;

async function updateCache() {
    let now = new Date();
    if (
        new Date().getTime() >
        teamsSearchCache.lastUpdate.getTime() + CACHE_UPDATE_TIME
    ) {
        let teams = await Team.find();

        teams.forEach((t) => (t.number = ("" + t.number) as any));
        teamsSearchCache.teams = teams;

        let combined = teams.map((t) => `${t.number} ${t.name}`.toLowerCase());
        teamsSearchCache.fuzzyset = FuzzySet(combined);

        teamsSearchCache.lastUpdate = now;
    }
}

let teamsSearchCache = {
    lastUpdate: new Date(0),
    fuzzyset: FuzzySet([]),
    teams: [] as Team[],
};

function getHighlightText(res: Fuzzysort.KeysResult<Team>): string {
    let numPart = fuzzysort.highlight(res[0]) ?? "" + res.obj.number;
    let namePart = fuzzysort.highlight(res[1]) ?? res.obj.name;
    return `${numPart} ${namePart}`;
}

function resultsStrict(searchText: string): TeamSearchResult[] {
    let results = fuzzysort.go(searchText, teamsSearchCache.teams, {
        limit: NUM_RESULTS,
        threshold: -10000,
        keys: ["number", "name"],
    });
    return results.map((r) => new TeamSearchResult(r.obj, getHighlightText(r)));
}

function resultsLax(searchText: string): TeamSearchResult[] {
    let results =
        teamsSearchCache.fuzzyset.get(
            searchText.toLowerCase(),
            undefined,
            0.25
        ) ?? [];
    return results.slice(0, NUM_RESULTS).map((r) => {
        let originalTeam = teamsSearchCache.teams.filter(
            (t) => `${t.number} ${t.name}`.toLowerCase() == r[1]
        )[0];
        return new TeamSearchResult(
            originalTeam,
            `${originalTeam.number} ${originalTeam.name}`
        );
    });
}
