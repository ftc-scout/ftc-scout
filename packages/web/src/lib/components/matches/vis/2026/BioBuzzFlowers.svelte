<script lang="ts" context="module">
    import { NectarType } from "$lib/graphql/generated/graphql-operations";

    type Side = "red" | "blue";

    function sideOf(el: NectarType | null | undefined): Side | null {
        if (el == NectarType.RedNectar) return "red";
        if (el == NectarType.BlueNectar) return "blue";
        return null;
    }

    export function flowerPoints(stack: (NectarType | null)[]): {
        owner: Side | null;
        points: Record<Side, number>;
        bonus: Side | null;
    } {
        let nectar = stack.map(sideOf).filter((s): s is Side => s != null);
        let points = { red: 0, blue: 0 };
        if (!nectar.length) return { owner: null, points, bonus: null };
        let owner = nectar[nectar.length - 1];
        let bonus = nectar[0];
        points[owner] += 2 * stack.length;
        points[bonus] += 5;
        return { owner, points, bonus };
    }
</script>

<script lang="ts">
    import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
    import { slide } from "svelte/transition";
    import type { Season } from "@ftc-scout/common";
    import type { FullMatchFragment } from "$lib/graphql/generated/graphql-operations";
    import { SM_OPEN_SECTIONS } from "../../score-modal/ScoreModal.svelte";

    type Scores2026 = Extract<
        NonNullable<FullMatchFragment["scores"]>,
        { __typename: "MatchScores2026" }
    >;

    export let scores: Scores2026;

    $: openSections = SM_OPEN_SECTIONS[scores.season as Season];
    $: open = !!$openSections["flowers"];

    const POLLEN_PX = 28;
    const NECTAR_PX = 34;
    const GAP_PX = 0;

    function stackHeight(stack: (NectarType | null)[]): number {
        let balls = stack.reduce((h, el) => h + (sideOf(el) ? NECTAR_PX : POLLEN_PX), 0);
        return balls + GAP_PX * Math.max(0, stack.length - 1);
    }

    const SIDES: Side[] = ["red", "blue"];
    const SIDE_NAME: Record<Side, string> = { red: "Red", blue: "Blue" };
    const NAMES: Record<NectarType, string> = {
        [NectarType.Pollen]: "Pollen",
        [NectarType.RedNectar]: "Red Nectar",
        [NectarType.BlueNectar]: "Blue Nectar",
    };

    // Both alliances have the field, just use red
    $: field = scores.red;
    $: flowers = [
        { name: "Red Alliance", stack: field.redAllianceFlowerState },
        { name: "Blue Alliance", stack: field.blueAllianceFlowerState },
        { name: "Scoring", stack: field.scoringFlowerState },
        { name: "Audience", stack: field.audienceFlowerState },
    ].map((f) => ({ ...f, stack: f.stack ?? [], ...flowerPoints(f.stack ?? []) }));

    $: total = {
        red: flowers.reduce((sum, f) => sum + f.points.red, 0),
        blue: flowers.reduce((sum, f) => sum + f.points.blue, 0),
    };

    $: flowerHeight = Math.max(
        stackHeight(Array(4).fill(NectarType.Pollen)),
        ...flowers.map((f) => stackHeight(f.stack))
    );

    function piecesText(stack: (NectarType | null)[]): string {
        if (!stack.length) return "Empty";
        let runs: { name: string; n: number }[] = [];
        for (let el of stack) {
            let name = el ? NAMES[el] : "Unknown";
            let last = runs[runs.length - 1];
            if (last?.name == name) last.n++;
            else runs.push({ name, n: 1 });
        }
        return (
            "Bottom to top: " +
            runs.map((r) => (r.n > 1 ? `${r.n} ${r.name}` : r.name)).join(", then ")
        );
    }

    function pointsTitle(f: (typeof flowers)[number], side: Side): string {
        let parts = [];
        if (f.owner == side) parts.push(`Owns the flower: ${f.stack.length} pieces × 2`);
        if (f.bonus == side) parts.push("Bottom nectar bonus: 5");
        return parts.join("\n");
    }
</script>

<section class="flowers">
    <h3>
        <!-- Show the flower points again, but as the header of an expandable section -->
        <button
            class="heading"
            aria-expanded={open}
            aria-controls="flowers-body"
            on:click={() => ($openSections["flowers"] = !open)}
        >
            <span class="title">
                <Fa
                    icon={faCaretRight}
                    style="transform: rotate({open
                        ? 90
                        : 0}deg); transition: transform 0.25s; width: 0.6em"
                />
                Flowers
            </span>
            {#each SIDES as s}
                <span class="data {s}" class:zero={!total[s]}>
                    <span class="sr-only">{SIDE_NAME[s]} total:</span>
                    {total[s]}
                </span>
            {/each}
        </button>
    </h3>

    {#if open}
        <div id="flowers-body" transition:slide={{ duration: 250 }}>
            <ul class="grid">
                {#each flowers as f}
                    <li>
                        <div
                            class="flower"
                            class:red={f.owner == "red"}
                            class:blue={f.owner == "blue"}
                            style:height="{flowerHeight}px"
                            role="img"
                            aria-label="{f.name} flower. {piecesText(f.stack)}"
                            title={piecesText(f.stack)}
                        >
                            {#each f.stack as el}
                                <span class="ball-wrap">
                                    <span class="ball {sideOf(el) ?? 'pollen'}" />
                                </span>
                            {/each}
                        </div>
                        <span class="name">{f.name}</span>
                        <span class="points">
                            {#each SIDES as s}
                                {#if f.points[s]}
                                    <span class="data {s}" title={pointsTitle(f, s)}>
                                        <span class="sr-only">{SIDE_NAME[s]}</span>
                                        +{f.points[s]}
                                    </span>
                                {/if}
                            {/each}
                            {#if !f.owner}
                                <span class="data zero">
                                    {f.stack.length ? "Not owned" : "Empty"}
                                </span>
                            {/if}
                        </span>
                    </li>
                {/each}
            </ul>

            <p class="legend" aria-hidden="true">
                <span class="key">
                    <span class="ball-wrap"><span class="ball pollen" /></span> Pollen
                </span>
                <span class="key">
                    <span class="ball-wrap"><span class="ball red" /></span> Red Nectar
                </span>
                <span class="key">
                    <span class="ball-wrap"><span class="ball blue" /></span> Blue Nectar
                </span>
            </p>
        </div>
    {/if}
</section>

<style>
    .flowers {
        margin-top: var(--lg-gap);
    }

    h3 {
        margin: 0;
        font-size: inherit;
    }

    .heading {
        display: grid;
        grid-template-columns: 1fr 100px 100px;
        width: 100%;
        padding: 0;
        border: none;
        background: var(--zebra-stripe-color);
        color: inherit;
        font: inherit;
        text-align: left;
        cursor: pointer;
    }
    .heading:focus-visible {
        outline: 2px solid var(--theme-color);
        outline-offset: -2px;
    }
    @media (max-width: 800px) {
        .heading {
            grid-template-columns: 1fr 80px 80px;
        }
    }

    .title {
        display: flex;
        align-items: center;
        gap: var(--md-gap);
        padding: var(--md-pad) var(--md-gap);
        font-weight: 700;
    }

    .data {
        padding: var(--md-pad);
        font-weight: bold;
        text-align: center;
    }
    .data.red {
        background: var(--red-team-bg-color);
        color: var(--red-team-text-color);
    }
    .data.blue {
        background: var(--blue-team-bg-color);
        color: var(--blue-team-text-color);
    }
    .data.zero {
        color: var(--grayed-out-text-color);
        font-weight: normal;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: var(--md-gap) var(--lg-gap);
        margin: 0;
        padding: var(--lg-gap) 0 0;
        list-style: none;
    }

    li {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--sm-gap);
    }

    .flower {
        display: flex;
        flex-direction: column-reverse;
        align-items: center;
        gap: 0;
        box-sizing: content-box;
        width: 44px;
        padding: 4px 0;
        border: 3px solid var(--sep-color);
        border-top: none;
        border-radius: 0 0 16px 16px;
    }
    .flower.red {
        border-color: var(--red-team-color);
        background: var(--red-team-bg-color);
    }
    .flower.blue {
        border-color: var(--blue-team-color);
        background: var(--blue-team-bg-color);
    }

    /* Laternating offset, so it looks less dull */
    .flower > .ball-wrap:nth-child(odd):not(:only-child) {
        transform: translateX(-3px);
    }
    .flower > .ball-wrap:nth-child(even) {
        transform: translateX(3px);
    }

    .name {
        margin-top: var(--sm-gap);
        font-weight: 600;
        text-align: center;
    }

    .points {
        display: flex;
        gap: var(--sm-gap);
    }
    .points .data {
        min-width: 3em;
        padding: 2px var(--md-pad);
        border-radius: 4px;
    }

    /* Without yellow is not really visible */
    .ball-wrap {
        display: inline-flex;
        flex: none;
        filter: drop-shadow(0 0 0.75px rgba(0, 0, 0, 0.6));
    }
    .ball {
        position: relative;
        display: block;
        flex: none;
        width: 28px;
        height: 28px;
        background: var(--ball);
        -webkit-mask: url(/img/artifact.svg) center / contain no-repeat;
        mask: url(/img/artifact.svg) center / contain no-repeat;
    }
    .ball::after {
        content: "";
        position: absolute;
        inset: 0;
        background: url(/img/artifact.svg) center / contain no-repeat;
        mix-blend-mode: multiply;
    }
    .ball.pollen {
        --ball: #f2bd00;
    }
    .ball.red,
    .ball.blue {
        width: 34px;
        height: 34px;
    }
    .ball.red {
        --ball: rgb(220, 45, 40);
    }
    .ball.blue {
        --ball: rgb(25, 120, 215);
    }

    .legend {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: var(--sm-gap) var(--lg-gap);
        margin: var(--lg-gap) 0 0;
        color: var(--secondary-text-color);
    }
    .key {
        display: inline-flex;
        align-items: center;
        gap: var(--sm-gap);
    }
    .key .ball {
        width: 22px;
        height: 22px;
    }

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
</style>
