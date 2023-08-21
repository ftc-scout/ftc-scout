<script lang="ts">
    import { tippyTheme } from "../../nav/DarkModeToggle.svelte";
    import { maybeTip } from "../../../util/tippy";
    import { createTippy } from "svelte-tippy";
    import Fa from "svelte-fa";
    import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
    import type { StatSetSection } from "@ftc-scout/common";

    type T = $$Generic;

    export let section: StatSetSection;

    $: colCount = section.columns.length;
    $: singleGroup = colCount == 1;
    $: colspan = singleGroup ? 2 : 1;

    let tippy = createTippy({});
</script>

<thead>
    <th class="name" style="grid-column: span {colspan}"> {section.name} </th>
    {#each singleGroup ? [] : section.columns as column}
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
        display: grid;
        grid-template-columns:
            minmax(var(--name-min-len), 1fr)
            repeat(var(--col-count), var(--col-width));
    }

    th {
        padding: var(--md-pad);
        font-weight: bold;

        text-align: center;
        white-space: nowrap;
    }

    .red {
        color: var(--stat-text-color);
        background: var(--red-stat-color);
    }
    .blue {
        color: var(--stat-text-color);
        background: var(--blue-stat-color);
    }
    .light-blue {
        color: var(--stat-text-color);
        background: var(--light-blue-stat-color);
    }
    .purple {
        color: var(--stat-text-color);
        background: var(--purple-stat-color);
    }
    .green {
        color: var(--stat-text-color);
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
