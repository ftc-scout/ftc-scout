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
    import { prettyPrintURL } from "$lib/util/format/pretty-print-url";
    import Fa from "svelte-fa";
    import {
        faGlobe,
        faLocationDot,
        faSchool,
        faPlus,
    } from "@fortawesome/free-solid-svg-icons";
    import DataFromFirst from "../../lib/components/DataFromFirst.svelte";
    import InfoIconRow from "../../lib/components/InfoIconRow.svelte";

    export let team: OperationStore<TeamQuery>;
    query(team);
    $: teamData = $team.data?.teamByNumber;

</script>

<MaxWidth width={"1000px"}>

        {#if !teamData}
        <Card>
            That team doesn't exist
        </Card>
        {:else}
        <Card>
            <!-- Add goto command for team search and remove hudson block -->
            <h1>{teamData.number} - {teamData.name}</h1>

            <InfoIconRow icon={faSchool}>
                {teamData.schoolName}
            </InfoIconRow>

            {#if teamData.website}
                <InfoIconRow icon={faGlobe}>
                    <a class="content" href={teamData.website}>
                        {prettyPrintURL(teamData.website)}
                    </a>
                </InfoIconRow>
            {/if}

            <InfoIconRow icon={faLocationDot}>
                {teamData.city}, {teamData.stateOrProvince}, {teamData.country}
            </InfoIconRow>

            <InfoIconRow icon={faPlus}>
                Rookie Year: {teamData.rookieYear}
            </InfoIconRow>

            <DataFromFirst/>
        </Card>
        <Card>
            <!-- just put in what you want here in this second card -->
            this team is cool!
        </Card>
        {/if}
</MaxWidth>
