<script lang="ts" context="module">
    export type SimpleTeamMatchParticipation = {
        station: Station;
        alliance: Alliance;
        team: {
            number: number;
            name: string;
        };
    };
</script>

<script lang="ts">
    import { createTippy } from "svelte-tippy";
    import {
        ConeType,
        type ConeLayout,
        Station,
        Alliance,
    } from "../../../../graphql/generated/graphql-operations";
    import { JType, JUNCTION_TYPES } from "./PowerPlayVis.svelte";

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    export let hoverPos: [number, number] | null;
    export let hoverJunction: number | null;
    export let cones: ConeLayout;
    export let teams: SimpleTeamMatchParticipation[];

    $: r1 = teams.find((t) => t.station == Station.One && t.alliance == Alliance.Red)!;
    $: r2 = teams.find((t) => t.station == Station.Two && t.alliance == Alliance.Red)!;
    $: b1 = teams.find((t) => t.station == Station.One && t.alliance == Alliance.Blue)!;
    $: b2 = teams.find((t) => t.station == Station.Two && t.alliance == Alliance.Blue)!;
    $: terminalCounts = [
        cones.redNearTerminal,
        cones.blueNearTerminal,
        cones.redFarTerminal,
        cones.blueFarTerminal,
    ];

    let tippy = createTippy({});

    function getOffset(junction: number): [number, number] {
        if (junction < 0 || JUNCTION_TYPES[junction % 5][Math.floor(junction / 5)] == JType.G) {
            return [0, 25];
        } else {
            return [0, 15];
        }
    }

    function computeContent(cones: ConeLayout, junction: number): string {
        if (junction < 0) {
            let jIndex = -junction - 1;
            let names = [
                "Red Near Terminal",
                "Red Far Terminal",
                "Blue Near Terminal",
                "Blue Far Terminal",
            ];
            let emoji = ["🔴", "🔴", "🔵", "🔵"];

            return `
            <b>${names[jIndex]}</b> <br/>
            ${emoji[jIndex]} × ${terminalCounts[jIndex]}
            `;
        }

        let x = junction % 5;
        let y = Math.floor(junction / 5);

        let typeName = {
            G: "Ground",
            L: "Low",
            M: "Medium",
            H: "High",
        }[JUNCTION_TYPES[x][y]];
        let letter = "ZYXWV"[y];

        let redBeaconText = isSafari
            ? "❤️"
            : `<span style="color: transparent; text-shadow: 0 0 0 #F44336;">👑</span>`;
        let blueBeaconText = isSafari
            ? "💙"
            : `<span style="color: transparent; text-shadow: 0 0 0 #1976D2;">👑</span>`;

        const CHARS = {
            [ConeType.RedCone]: "🔴",
            [ConeType.BlueCone]: "🔵",
            [ConeType.RedBeacon1]: redBeaconText,
            [ConeType.RedBeacon2]: redBeaconText,
            [ConeType.BlueBeacon1]: blueBeaconText,
            [ConeType.BlueBeacon2]: blueBeaconText,
        };

        const truncate = (input: string) =>
            input.length > 20 ? `${input.substring(0, 20)}…` : input;
        const TEAM_NUMS = {
            [ConeType.RedCone]: "?",
            [ConeType.BlueCone]: "?",
            [ConeType.RedBeacon1]: r1.team.number + " " + truncate(r1.team.name),
            [ConeType.RedBeacon2]: r2.team.number + " " + truncate(r2.team.name),
            [ConeType.BlueBeacon1]: b1.team.number + " " + truncate(b1.team.name),
            [ConeType.BlueBeacon2]: b2.team.number + " " + truncate(b2.team.name),
        };

        let stack = cones.junctions[y][x];
        let redCones = stack.filter((c) => c == ConeType.RedCone).length;
        let blueCones = stack.filter((c) => c == ConeType.BlueCone).length;
        let beaconType = stack.find((c) => c != ConeType.RedCone && c != ConeType.BlueCone);

        let beaconChar = beaconType ? ` | ${CHARS[beaconType]} (${TEAM_NUMS[beaconType]})` : "";
        let redConesText = redCones ? `🔴 × ${redCones}` : "";
        let blueConesText = blueCones ? (redCones ? " | " : "") + `🔵 × ${blueCones}` : "";
        let conesText = stack
            .map((c) => CHARS[c])
            .reverse()
            .join("");
        let conesFullText =
            stack.length == 0 ? "" : `<br/><hr style="margin: 4px 0"/>${conesText}⬅️`;

        return `
        <b>${typeName} Junction ${letter}${x + 1}</b> <br/>
        ${redConesText}${blueConesText}${beaconChar}
        ${conesFullText}
        `;
    }

    $: tipText = hoverJunction == null ? "" : computeContent(cones, hoverJunction);
</script>

{#if hoverPos && hoverJunction != null}
    {#key (hoverPos[0], hoverPos[1])}
        <div
            class="hover"
            style="left: {hoverPos[0]}px; top: {hoverPos[1]}px"
            use:tippy={{
                placement: "right",
                offset: getOffset(hoverJunction),
                showOnCreate: true,
                hideOnClick: false,
                content: tipText,
                allowHTML: true,
                theme: "light",
                zIndex: 100000,
            }}
        />
    {/key}
{/if}

<style>
    .hover {
        position: absolute;
        width: 0px;
        height: 0px;
    }
</style>
