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
<style>
    /* Change this so im not plagiarizing off of someone else who may be working on this project */
    .edit-button {
    border: var(--theme-color) 2px solid;
    text-decoration: none;

    background-color: transparent;
    color: var(--theme-color);
    font-weight: bold;
    font-size: var(--small-font-size);
    padding: var(--padding) var(--ml-padding);
    margin: 0 var(--small-gap);
    border-radius: var(--pill-border-radius);

    display: inline-block;

    cursor: pointer;
}
.edit-button:hover {
        /* maybe like add a fade in transition to the hover colours */
        background-color: var(--theme-color);
        color: var(--theme-text-color);
    }
</style>
<MaxWidth width={"1000px"}>
    {#if !teamData}
        <Card>That team doesn't exist</Card>
    {:else}
        <Card>
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

            <DataFromFirst />
        </Card>
        <button class="edit-button" type="button">Edit Document</button>
        <Card>
            <!-- TODO: have the button make it editable or not -->
            <!-- TODO: Save changes made -->
            <!-- TODO: Make it so you can only edit if your team matches the team you're editing -->
            <p1> <input type ="text"  disabled value ="hi"/>
            </p1>
        </Card>
    {/if}
</MaxWidth>
