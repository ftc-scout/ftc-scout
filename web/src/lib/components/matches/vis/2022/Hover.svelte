<script lang="ts">
    import { getTrois } from "svelte-trois";
    import { GetChildren } from "svelte-trois";
    import * as THREE from "three";
    import * as SC from "svelte-cubed";
    import { junctionHeight, junctionType } from "./PowerPlayVisModal.svelte";
    import { fieldPoint } from "./Field.svelte";
    import { tippy } from "svelte-tippy";
    import "tippy.js/themes/light.css";
    import {
        ConeType,
        Station,
        type ConeLayout,
        type TeamMatchParticipation,
    } from "../../../../graphql/generated/graphql-operations";

    export let teams: TeamMatchParticipation[];
    export let layout: ConeLayout;

    $: r1 = teams.find((t) => t.station == Station.Red_1);
    $: r2 = teams.find((t) => t.station == Station.Red_2);
    $: r3 = teams.find((t) => t.station == Station.Red_3);
    $: b1 = teams.find((t) => t.station == Station.Blue_1);
    $: b2 = teams.find((t) => t.station == Station.Blue_2);
    $: b3 = teams.find((t) => t.station == Station.Blue_3);
    $: redTeams = [r1, r2, r3].filter((t) => t && t.onField);
    $: blueTeams = [b1, b2, b3].filter((t) => t && t.onField);
    $: terminalCounts = [
        layout.redNearTerminal,
        layout.blueNearTerminal,
        layout.redFarTerminal,
        layout.blueFarTerminal,
    ];

    let ctx = getTrois();
    let raycaster = new THREE.Raycaster();

    let mouseX: number = Infinity;
    let mouseY: number = Infinity;

    let hoverTarget: [number, number] | null = null;
    let hoverPos: [number, number] = [0, 0];

    SC.onFrame(() => {
        if (ctx.camera && ctx.canvas) {
            let pointer = new THREE.Vector2();
            let bounds = ctx.canvas.getBoundingClientRect();
            if (mouseX < bounds.left || mouseX > bounds.right || mouseY < bounds.top || mouseY > bounds.bottom) {
                hoverTarget = null;
                return;
            }
            pointer.x = ((mouseX - bounds.left) / bounds.width) * 2 - 1;
            pointer.y = ((mouseY - bounds.top) / bounds.height) * -2 + 1;

            raycaster.setFromCamera(pointer, ctx.camera);
            let intersects = raycaster.intersectObjects(ctx.scene.children, true);
            if (intersects.length > 0) {
                let firstIntersect = intersects[0];
                let targetIndex = targets.indexOf(firstIntersect.object);
                if (targetIndex != -1) {
                    if (targetIndex >= 25) {
                        hoverTarget = [-1, targetIndex - 25];
                    } else {
                        let junctionX = targetIndex % 5;
                        let junctionY = Math.floor(targetIndex / 5);
                        hoverTarget = [junctionX, junctionY];
                    }
                    let widthHalf = bounds.width / 2;
                    let heightHalf = bounds.height / 2;

                    let pos = firstIntersect.object.position.clone();
                    pos.project(ctx.camera);
                    let screenX = pos.x * widthHalf + widthHalf;
                    let screenY = -(pos.y * heightHalf) + heightHalf;
                    hoverPos = [screenX, screenY];
                } else {
                    hoverTarget = null;
                }
            } else {
                hoverTarget = null;
            }
        }
    });

    let targets: THREE.Object3D[] = [];
    $: targets.forEach((t) => (t.visible = false));

    function computeTipText(x: number, y: number): string {
        if (x < 0) {
            let names = ["Red Near Terminal", "Blue Near Terminal", "Red Far Terminal", "Blue Far Terminal"];
            let emoji = ["🔴", "🔵", "🔴", "🔵"];

            return `
            <b>${names[y]}</b> <br/>
            ${emoji[y]} × ${terminalCounts[y]}
            `;
        }

        let typeName = {
            G: "Ground",
            L: "Low",
            M: "Medium",
            H: "High",
        }[junctionType(x, y)];
        let letter = "ZYXWV"[y];

        const CHARS = {
            [ConeType.RedCone]: "🔴",
            [ConeType.BlueCone]: "🔵",
            [ConeType.RedBeacon_1]: "❤️",
            [ConeType.RedBeacon_2]: "❤️",
            [ConeType.BlueBeacon_1]: "💙",
            [ConeType.BlueBeacon_2]: "💙",
        };

        const truncate = (input: string) => (input.length > 20 ? `${input.substring(0, 20)}…` : input);
        const TEAM_NUMS = {
            [ConeType.RedCone]: "?",
            [ConeType.BlueCone]: "?",
            [ConeType.RedBeacon_1]: redTeams[0]?.teamNumber + " " + truncate(redTeams[0]?.team?.name),
            [ConeType.RedBeacon_2]: redTeams[1]?.teamNumber + " " + truncate(redTeams[1]?.team?.name),
            [ConeType.BlueBeacon_1]: blueTeams[0]?.teamNumber + " " + truncate(blueTeams[0]?.team?.name),
            [ConeType.BlueBeacon_2]: blueTeams[1]?.teamNumber + " " + truncate(blueTeams[1]?.team?.name),
        };

        let stack = layout.junctions[y][x];
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
        let conesFullText = stack.length == 0 ? "" : `<br/><hr style="margin: 4px 0"/>${conesText}⬅️`;

        return `
        <b>${typeName} Junction ${letter}${x + 1}</b> <br/>
        ${redConesText}${blueConesText}${beaconChar}
        ${conesFullText}
        `;
    }

    $: tipText = hoverTarget == null ? "" : computeTipText(hoverTarget[0], hoverTarget[1]);
</script>

<svelte:window
    on:mousemove={(e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }}
/>

{#if hoverTarget}
    <div
        class="hover"
        style="left: {hoverPos[0]}px; top: {hoverPos[1]}px"
        use:tippy={{
            placement: "right",
            offset: [0, hoverTarget[0] < 0 || junctionType(hoverTarget[0], hoverTarget[1]) == "G" ? 20 : 15],
            showOnCreate: true,
            hideOnClick: false,
            content: tipText,
            allowHTML: true,
            theme: "light",
            zIndex: 100000,
        }}
    />
{/if}

<GetChildren bind:children={targets}>
    {#each [...Array(5).keys()] as x}
        {#each [...Array(5).keys()] as y}
            {@const type = junctionType(x, y)}
            {@const height = Math.max(junctionHeight(x, y), layout.junctions[x][y].length * 1.25 + 3.75)}

            {#if type == "G"}
                <SC.Mesh
                    geometry={new THREE.CylinderGeometry(3, 3, height, 20)}
                    position={fieldPoint(x, y, height / 2)}
                />
            {:else}
                <SC.Mesh
                    geometry={new THREE.CylinderGeometry(3, 3, height, 20)}
                    position={fieldPoint(x, y, height / 2)}
                />
            {/if}
        {/each}
    {/each}

    {#each [[-0.75, -0.75], [4.75, -0.75], [4.75, 4.75], [-0.75, 4.75]] as [x, y], i}
        {@const height = terminalCounts[i] ? terminalCounts[i] * 1.25 + 3.75 : 0}
        <SC.Mesh geometry={new THREE.CylinderGeometry(3, 3, height, 20)} position={fieldPoint(x, y, height / 2)} />
    {/each}
</GetChildren>

<style>
    .hover {
        position: absolute;
        width: 0px;
        height: 0px;
    }

    :global(.tippy-box[data-theme~="light"]) {
        font-size: var(--font-size);
    }
</style>
