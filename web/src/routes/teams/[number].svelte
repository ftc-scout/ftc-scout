<script context="module" lang="ts">
    import { query, type OperationStore } from "@urql/svelte";
    import {
        TeamDocument,
        type TeamQuery,
    } from "../../lib/graphql/generated/graphql-operations";
    import { queryLoad } from "../../lib/graphql/query-load";

    export const load = queryLoad("team", TeamDocument, ({ params }) => ({
        number: +params.number,
    }));
</script>

<script lang="ts">
    import MaxWidth from "$lib/components/MaxWidth.svelte";
    import Card from "$lib/components/Card.svelte";
    import { prettyPrintURL } from "$lib/format/pretty-print-url";
    import Fa from "svelte-fa";
    import {
        faGlobe,
        faLocationDot,
        faSchool,
        faPlus,
    } from "@fortawesome/free-solid-svg-icons";

    export let team: OperationStore<TeamQuery>;
    query(team);
    $: teamData = $team.data?.teamByNumber;
</script>

<MaxWidth width={"1000px"}>
    <Card>
        {#if !teamData}
            That team doesn't exist
        {:else}
            <!-- Add goto command for team search and remove hudson block -->
            <h1>{teamData.number} - {teamData.name}</h1>

            <div class="info-icon">
                <Fa fw icon={faSchool} size="lg" color="var(--theme-color)" />
                <span class="content">{teamData.schoolName}</span>
            </div>
            {#if teamData.website}
                <div class="info-icon">
                    <Fa
                        fw
                        icon={faGlobe}
                        size="lg"
                        color="var(--theme-color)"
                    />
                    <a class="content" href={teamData.website}>
                        {prettyPrintURL(teamData.website)}
                    </a>
                </div>
            {/if}
            <div class="info-icon">
                <Fa
                    fw
                    icon={faLocationDot}
                    size="lg"
                    color="var(--theme-color)"
                />
                <span class="content">
                    {teamData.city}, {teamData.stateOrProvince}, {teamData.country}
                </span>
            </div>
            <div class="info-icon">
                <Fa fw icon={faPlus} size="lg" color="var(--theme-color)" />
                <span class="content">Rookie Year: {teamData.rookieYear}</span>
            </div>
        {/if}
    </Card>
</MaxWidth>

<style>
    h1 {
        font-size: 32px;
        margin-top: var(--large-gap);
        margin-bottom: var(--large-gap);
    }

    .info-icon {
        display: flex;
        flex-direction: row;
        align-items: center;

        margin-bottom: var(--gap);
    }

    .info-icon .content {
        margin-left: var(--gap);
    }
</style>
