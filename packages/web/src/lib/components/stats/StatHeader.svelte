<script lang="ts">
    import type { SortDir } from "./StatTableControls.svelte";
    import { createEventDispatcher } from "svelte";
    import { stickTableHead } from "../../util/directives";
    import SortButton from "./SortButton.svelte";
    import type { StatColumn } from "./stat-table";

    type T = $$Generic;

    export let stats: StatColumn<T>[];
    export let currentSort: { id: string; dir: SortDir };
    export let rankStat: StatColumn<T> | null;

    let dispatch = createEventDispatcher();

    let elements: HTMLElement[] = [];
    function draggable(element: HTMLElement, i: number) {
        let moving = false;
        let xOffset = 0;
        let mouseXOffset = 0;
        let lastScroll = 0;
        let offsetsAndWidths: [number, number][] = [];

        let placeholder: HTMLElement;
        let shadow: HTMLElement;
        let moveIndicator: HTMLElement;

        let thead: HTMLElement;
        let table: HTMLElement;

        function getParents() {
            thead = element.parentElement!;
            table = thead.parentElement!;
        }

        function getOffsetAndWidth(element: HTMLElement | null): [number, number] {
            if (!element) return [100000, 100000];

            let pos = element.getBoundingClientRect();
            let parentPos = thead.getBoundingClientRect();
            return [pos.left - parentPos.left, pos.right - pos.left];
        }

        function recalculateOffsets() {
            if (moving) offsetsAndWidths = elements.map(getOffsetAndWidth);
        }

        function calcNewPosition(): number {
            for (let j = 0; j < stats.length; j++) {
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

        function watchScroll(_: Event) {
            mouseXOffset += table.scrollLeft - lastScroll;
            xOffset += table.scrollLeft - lastScroll;
            lastScroll = table.scrollLeft;
            moveTo();
        }

        function moveTo() {
            element.style.left = xOffset + "px";
            shadow.style.left = xOffset + "px";
            let newPos = calcNewPosition();
            if (newPos != i) {
                let offset =
                    newPos == stats.length
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

                getParents();
                let pos = element.getBoundingClientRect();
                let parentPos = thead.getBoundingClientRect();
                let width = pos.right - pos.left; // using these of clientWidth/Height gives values to the exact subpixels.
                let height = pos.bottom - pos.top;
                xOffset = pos.left - parentPos.left;
                mouseXOffset = e.x - parentPos.left;

                recalculateOffsets();

                placeholder = document.createElement("td");
                placeholder.style.minWidth = `${width}px`;
                placeholder.style.height = `${height}px`;
                placeholder.style.background = "var(--sep-color)";
                thead.replaceChild(placeholder, element);

                shadow = document.createElement("div");
                shadow.style.position = "absolute";
                shadow.style.background = "#00000030"; // TODO
                shadow.style.width = `${width}px`;
                shadow.style.top = `${height}px`;
                shadow.style.bottom = "0";
                table.appendChild(shadow);

                moveIndicator = document.createElement("div");
                moveIndicator.style.position = "absolute";
                moveIndicator.style.background = "gray"; // TODO
                moveIndicator.style.width = `2px`;
                moveIndicator.style.top = `${height}px`;
                moveIndicator.style.bottom = "0";
                table.appendChild(moveIndicator);

                thead.appendChild(element);
                element.style.position = "absolute";
                element.style.display = "block";
                element.style.width = `${width}px`;
                element.style.height = `${height}px`;
                element.style.cursor = "grabbing";
                element.style.borderRadius = "0";
                moveTo();

                table.addEventListener("scroll", watchScroll);
                lastScroll = table.scrollLeft;
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
                let newPos = calcNewPosition();
                if (i != newPos)
                    dispatch("move_column", { oldPos: i, newPos: newPos - (i < newPos ? 1 : 0) });

                moving = false;
                element.style.position = "";
                element.style.left = "";
                element.style.width = "";
                element.style.height = "";
                element.style.display = "";
                element.style.cursor = "";
                element.style.borderRadius = "";
                thead.replaceChild(element, placeholder!);
                table.removeChild(shadow!);
                table.removeChild(moveIndicator!);
                table.removeEventListener("scroll", watchScroll);
            }
        }

        document.addEventListener("mousedown", down);
        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", up);
        window.addEventListener("resize", recalculateOffsets);

        return {
            destroy() {
                document.removeEventListener("mousedown", down);
                document.removeEventListener("mousemove", move);
                document.removeEventListener("mouseup", up);
                window.removeEventListener("resize", recalculateOffsets);
            },
        };
    }
</script>

<thead use:stickTableHead>
    {#if rankStat}
        <th class="{rankStat.color} empty" />
    {/if}

    {#each stats as stat, i}
        {@const sort = stat.id == currentSort.id ? currentSort.dir : null}
        <th
            class={stat.color}
            class:expand={stat.shouldExpand()}
            bind:this={elements[i]}
            use:draggable={i}
        >
            {stat.columnName}
            <SortButton
                name={stat.columnName}
                {sort}
                on:click={() => dispatch("change_sort", stat.id)}
            />
        </th>
    {/each}
</thead>

<style>
    th {
        padding: var(--lg-pad);
        font-weight: bold;
        text-align: center;
        white-space: nowrap;

        user-select: none;
        cursor: grab;

        color: var(--stat-text-color);
    }

    .empty {
        cursor: inherit;
    }

    @media (max-width: 600px) {
        th {
            padding: var(--lg-pad) var(--sm-pad);
        }
    }

    .expand {
        width: 100%;
    }

    .white {
        color: var(--text-color);
        box-shadow: rgb(0 0 0 / 14%) 0px -4px 4px -2px inset;
        background: var(--fg-color);
    }

    .red {
        background: var(--red-stat-color);
    }
    .blue {
        background: var(--blue-stat-color);
    }
    .light-blue {
        background: var(--light-blue-stat-color);
    }
    .purple {
        background: var(--purple-stat-color);
    }
    .green {
        background: var(--green-stat-color);
    }
</style>
