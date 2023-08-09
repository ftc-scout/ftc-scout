<script lang="ts">
    import { tippyTheme } from "../../nav/DarkModeToggle.svelte";
    import { maybeTip } from "../../../util/tippy";
    import { createTippy } from "svelte-tippy";
    import Fa from "svelte-fa";
    import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
    import type { StatSetSection } from "../stat-table";

    type T = $$Generic;

    export let section: StatSetSection;

    let tippy = createTippy({});
</script>

<thead>
    <th class="name">{section.name}</th>
    {#each section.columns as column}
        <th class="{column.color} col" use:tippy={maybeTip(column.description, $tippyTheme)}>
            <div>
                {column.name}
                {#if column.description}
                    <span> <Fa icon={faQuestionCircle} /> </span>
                {/if}
            </div>
        </th>
    {/each}
</thead>

<style>
    thead {
        display: flex;
        flex-direction: row;
        width: 100%;
    }

    th {
        min-width: 75px;
        padding: var(--md-pad);
        font-weight: bold;
    }

    @media (max-width: 700px) {
        th {
            min-width: 50px;
        }
    }

    .name {
        flex-grow: 1;
    }

    .col {
        color: var(--stat-text-color);
    }
    .purple {
        background: var(--purple-stat-color);
    }
    .green {
        background: var(--green-stat-color);
    }

    .col div {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--sm-gap);

        cursor: default;
    }

    .col span {
        font-size: var(--xs-font-size);
    }
</style>
