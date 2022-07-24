<script lang="ts">
    import type { StatList } from "../../util/stats/Stat";
    import { StatDisplayType } from "../../util/stats/stat-display-type";
    import { RP_STAT, type FullStats_TeamEventStats2021Traditional_Fragment } from "../../util/stats/StatsTrad2021";

    export let stats: {
        team: {
            number: number;
            name: string;
        };
        stats: FullStats_TeamEventStats2021Traditional_Fragment;
    }[];

    let shownStats: StatList<FullStats_TeamEventStats2021Traditional_Fragment> = ["team", RP_STAT];
</script>

<table>
    <thead>
        {#each shownStats as shownStat}
            {#if shownStat == "team"}
                <td>Team</td>
            {:else}
                <td>{shownStat.shortName}</td>
            {/if}
        {/each}
    </thead>
    <tbody>
        {#each stats as team}
            <tr>
                {#each shownStats as shownStat}
                    {#if shownStat == "team"}
                        <td>{team.team.number} {team.team.name}</td>
                    {:else if shownStat.displayType == StatDisplayType.INTEGER}
                        {@const value = shownStat.read(team.stats)}
                        <td>{value}</td>
                    {/if}
                {/each}
            </tr>
        {/each}
    </tbody>
</table>
