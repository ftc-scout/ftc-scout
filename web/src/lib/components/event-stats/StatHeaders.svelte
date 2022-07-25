<script lang="ts">
    import { onMount } from "svelte";
    import { array_move } from "../../util/array-move";
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

    function getOffsetAndWidth(element: HTMLElement | null): [number, number] {
        if (!element) return [100000, 100000];

        let pos = element.getBoundingClientRect();
        let parentPos = element.parentElement!.getBoundingClientRect();
        return [pos.left - parentPos.left, pos.right - pos.left];
    }

    let elements: HTMLElement[] = [];
    let offsetsAndWidths: [number, number][] = [];
    function recalcOffsets() {
        offsetsAndWidths = elements.map(getOffsetAndWidth);
    }
    onMount(recalcOffsets);

    function draggable(element: HTMLElement, i: number) {
        let moving = false;
        let xOffset = 0;
        let mouseXOffset = 0;
        let placeholder: HTMLElement;
        let shadow: HTMLElement;
        let moveIndicator: HTMLElement;
        let parent: HTMLElement = element.parentElement!;

        function calcNewPosition(): number {
            for (let j = 0; j < shownStats.length; j++) {
                let [offset, width] = offsetsAndWidths[j];
                let left = offset;
                let middle = offset + width / 2;
                let right = offset + width;
                if (mouseXOffset >= left && mouseXOffset < middle) {
                    return j == i ? i : j == i + 1 ? j + 1 : j;
                } else if (mouseXOffset >= middle && mouseXOffset < right) {
                    return j == i ? i : j == i - 1 ? j : j + 1;
                }
            }
            return i;
        }

        function moveTo() {
            element.style.left = `${xOffset}px`;
            shadow.style.left = `${xOffset}px`;
            let newPos = calcNewPosition();
            if (newPos != i) {
                let offset =
                    newPos == shownStats.length
                        ? offsetsAndWidths[newPos - 1][0] + offsetsAndWidths[newPos - 1][1] - 2
                        : Math.max(offsetsAndWidths[newPos][0] - 1, 0);
                moveIndicator.style.left = `${offset}px`;
            } else {
                moveIndicator.style.left = `-1000px`;
            }
        }

        function down(e: MouseEvent) {
            if (e.target == element) {
                moving = true;

                parent = element.parentElement!;
                let pos = element.getBoundingClientRect();
                let parentPos = parent.getBoundingClientRect();
                let width = pos.right - pos.left; // using these of clientWidth/Height gives values to the exact subpixels.
                let height = pos.bottom - pos.top;
                xOffset = pos.left - parentPos.left;
                mouseXOffset = e.x - parentPos.left;

                placeholder = document.createElement("td");
                placeholder.style.minWidth = `${width}px`;
                placeholder.style.height = `${height}px`;
                placeholder.style.background = "var(--neutral-separator-color)";
                parent.replaceChild(placeholder, element);

                shadow = document.createElement("div");
                shadow.style.position = "absolute";
                shadow.style.background = "#00000030";
                shadow.style.width = `${width}px`;
                shadow.style.top = `${height}px`;
                shadow.style.bottom = "0";
                parent.parentElement?.appendChild(shadow);

                moveIndicator = document.createElement("div");
                moveIndicator.style.position = "absolute";
                moveIndicator.style.background = "gray";
                moveIndicator.style.width = `2px`;
                moveIndicator.style.top = `${height}px`;
                moveIndicator.style.bottom = "0";
                parent.parentElement?.appendChild(moveIndicator);

                parent.appendChild(element);
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
                xOffset += e.movementX;
                mouseXOffset += e.movementX;
                moveTo();
            }
        }

        function up() {
            if (moving) {
                let newPosition = calcNewPosition();
                shownStats = array_move(shownStats, i, newPosition - 1);

                moving = false;
                element.style.position = "";
                element.style.left = "";
                element.style.width = "";
                element.style.height = "";
                element.style.display = "";
                element.style.cursor = "";
                parent.replaceChild(element, placeholder!);
                parent.parentElement!.removeChild(shadow!);
                parent.parentElement!.removeChild(moveIndicator!);

                setTimeout(recalcOffsets, 1);
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
    {#each shownStats as shownStat, i}
        {@const mySort = shownStat == sort?.stat ? sort.type : SortType.NONE}
        {#if shownStat == "team"}
            <th class="team white" use:draggable={i} bind:this={elements[i]}>
                Team
                <SortButton sort={mySort} on:click={() => handleClick(shownStat)} />
            </th>
        {:else}
            <th class={shownStat.color} title={shownStat.longName} use:draggable={i} bind:this={elements[i]}>
                {shownStat.shortName}
                <SortButton sort={mySort} on:click={() => handleClick(shownStat)} />
            </th>
        {/if}
    {/each}
</thead>

<style>
    thead {
        position: relative;
        overflow: hidden;
    }

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
