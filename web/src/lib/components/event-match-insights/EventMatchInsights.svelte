<script lang="ts">
    import type { EventPageMatchFragment, RecordsEventFragment } from "../../graphql/generated/graphql-operations";
    import MatchStats2019 from "./MatchStats2019.svelte";
    import MatchStats2020Remote from "./MatchStats2020Remote.svelte";
    import MatchStats2020Trad from "./MatchStats2020Trad.svelte";
    import MatchStats2021Remote from "./MatchStats2021Remote.svelte";
    import MatchStats2021Trad from "./MatchStats2021Trad.svelte";
    import MatchStats2022 from "./MatchStats2022.svelte";

    export let matches: EventPageMatchFragment[];
    export let event: RecordsEventFragment;
    export let selectedTeam: number | null;

    function getScores(match: EventPageMatchFragment): any[] {
        if (!match.scores) return [];
        if ("red" in match.scores && "blue" in match.scores) return [match.scores.red, match.scores.blue];
        return [match.scores];
    }

    function process(match: EventPageMatchFragment): any[] {
        let scores = getScores(match).map((s) => ({ ...s }));
        for (let score of scores) {
            score.match = match;
            score.event = event;
            if (scores.length == 2) {
                score.opponentsScore = scores.find((s) => s != score);
            }
        }
        return scores;
    }

    $: scores = matches.flatMap(process);

    console.log(scores);
</script>

{#if event.season == 2022}
    <MatchStats2022 data={scores} eventName={event.name} bind:selectedTeam />
{:else if event.season == 2021 && event.remote}
    <MatchStats2021Remote data={scores} eventName={event.name} bind:selectedTeam />
{:else if event.season == 2021 && !event.remote}
    <MatchStats2021Trad data={scores} eventName={event.name} bind:selectedTeam />
{:else if event.season == 2020 && event.remote}
    <MatchStats2020Remote data={scores} eventName={event.name} bind:selectedTeam />
{:else if event.season == 2020 && !event.remote}
    <MatchStats2020Trad data={scores} eventName={event.name} bind:selectedTeam />
{:else if event.season == 2019}
    <MatchStats2019 data={scores} eventName={event.name} bind:selectedTeam />
{/if}
