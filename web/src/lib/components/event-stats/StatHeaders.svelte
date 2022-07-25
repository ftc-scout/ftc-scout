<script lang="ts">
    import type { Stat, StatList } from "../../util/stats/Stat";
    import SortButton, { toggleSortType, SortType } from "../SortButton.svelte";

    export let shownStats: StatList<unknown>;

    type ChosenSort = {
        stat: Stat<unknown> | "team";
        type: SortType.HIGH_LOW | SortType.LOW_HIGH;
    };

    export let defaultSort: ChosenSort;
    export let sort: ChosenSort = defaultSort;

    function handleClick(stat: Stat<unknown> | "team") {
        let currentSort = sort?.stat == stat ? sort.type : SortType.NONE;
        let newSort = toggleSortType(currentSort);

        sort = {
            stat,
            type: newSort,
        };
    }

    function draggable(element: HTMLElement) {
        let moving = false;
        let mousePos = { x: 0, y: 0 };
        let placeholder: HTMLElement | null = null;
        let parent: HTMLElement | null = null;

        function moveTo() {
            element.style.left = `${mousePos.x}px`;
            element.style.top = `${mousePos.y}px`;
        }

        function down(e: MouseEvent) {
            if (e.target == element) {
                moving = true;

                let pos = element.getBoundingClientRect();
                let width = pos.right - pos.left; // using these of clientWidth/Height gives values to the exact subpixels.
                let height = pos.bottom - pos.top;
                parent = element.parentElement!;
                mousePos = { x: pos.left, y: pos.top };

                placeholder = document.createElement("td");
                placeholder.style.minWidth = `${width}px`;
                placeholder.style.height = `${height}px`;
                placeholder.style.background = "var(--neutral-separator-color)";
                parent.replaceChild(placeholder, element);

                document.body.appendChild(element);
                element.style.position = "absolute";
                element.style.display = "block";
                element.style.width = `${width}px`;
                element.style.height = `${height}px`;
                element.style.cursor = "grabbing";
                moveTo();
            }
        }

        function move(e: MouseEvent) {
            if (moving) {
                mousePos.x += e.movementX;
                mousePos.y += e.movementY;
                moveTo();
            }
        }

        function up() {
            if (moving) {
                moving = false;
                element.style.position = "";
                element.style.left = "";
                element.style.top = "";
                element.style.width = "";
                element.style.height = "";
                element.style.display = "";
                element.style.cursor = "";
                parent?.replaceChild(element, placeholder!);
            }
        }

        document.addEventListener("mousedown", down);
        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", up);

        return {
            destroy() {
                document.removeEventListener("mousedown", down);
                document.removeEventListener("mousemove", move);
                document.removeEventListener("mouseup", up);
            },
        };
    }
</script>

<thead>
    {#each shownStats as shownStat}
        {@const mySort = shownStat == sort?.stat ? sort.type : SortType.NONE}
        {#if shownStat == "team"}
            <th class="team white" use:draggable>
                Team
                <SortButton sort={mySort} on:click={() => handleClick(shownStat)} />
            </th>
        {:else}
            <th class={shownStat.color} title={shownStat.longName} use:draggable>
                {shownStat.shortName}
                <SortButton sort={mySort} on:click={() => handleClick(shownStat)} />
            </th>
        {/if}
    {/each}
</thead>

<style>
    th {
        padding: var(--large-padding);
        font-weight: bold;
        text-align: center;
        white-space: nowrap;

        user-select: none;

        cursor: grab;

        position: sticky;
    }

    .team {
        width: 100%;
    }

    .white {
        background: var(--foreground-color);
        box-shadow: rgb(0 0 0 / 14%) 0px -4px 4px -2px inset;
    }

    .red {
        background: var(--red-stat-color);
        color: var(--stat-heading-text-color);
    }

    .blue {
        background: var(--blue-stat-color);
        color: var(--stat-heading-text-color);
    }

    .light-blue {
        background: var(--light-blue-stat-color);
        color: var(--stat-heading-text-color);
    }

    .green {
        background: var(--green-stat-color);
        color: var(--stat-heading-text-color);
    }

    .purple {
        background: var(--purple-stat-color);
        color: var(--stat-heading-text-color);
    }

    .moving {
        content: "";
        background: var(--neutral-separator-color);
        box-shadow: none;
        color: transparent;
        cursor: grabbing;
    }
</style>
