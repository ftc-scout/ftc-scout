<script lang="ts" context="module">
    import type { BufferGeometry } from "three";
    import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
    import { writable, type Writable } from "svelte/store";

    let beaconGeometry: Writable<BufferGeometry | null> = writable(null);
    let loaded = false;

    async function loadBeacon() {
        if (loaded) return;
        loaded = true;

        let loader = new STLLoader();
        beaconGeometry.set(await loader.loadAsync("/models/Beacon.stl"));
    }
</script>

<script lang="ts">
    import { T } from "@threlte/core";
    import { onMount } from "svelte";
    import * as THREE from "three";
    import { Color } from "@ftc-scout/common";
    import { ConeType, type ConeLayout } from "../../../../graphql/generated/graphql-operations";
    import { fPos3, INCH_TO_METER } from "../Field.svelte";
    import { JType, JUNCTION_HEIGHTS, JUNCTION_TYPES } from "./PowerPlayVis.svelte";
    import { BLUE_CONE_MAT, RED_CONE_MAT } from "./Cones.svelte";

    onMount(loadBeacon);

    function calcPositions(layout: ConeLayout): [[number, number, number], Color][] {
        const GAP = 1.25;

        let res: [[number, number, number], Color][] = [];

        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {
                for (let scoringElement of layout.junctions[x][y]) {
                    if (scoringElement != ConeType.RedCone && scoringElement != ConeType.BlueCone) {
                        let color =
                            scoringElement == ConeType.RedBeacon1 ||
                            scoringElement == ConeType.RedBeacon2
                                ? Color.Red
                                : Color.Blue;
                        let jHeight = JUNCTION_HEIGHTS[JUNCTION_TYPES[x][y]] - 2.5;
                        let coneHeight =
                            (layout.junctions[x][y].length - 1) * GAP +
                            (JUNCTION_TYPES[x][y] == JType.G ? 0.56 : 0);
                        let minHeight = 0.56;
                        res.push([
                            fPos3(x + 1, y + 1, Math.max(jHeight, coneHeight, minHeight)),
                            color,
                        ]);
                    }
                }
            }
        }

        return res;
    }

    export let cones: ConeLayout;
    $: positions = calcPositions(cones);
</script>

{#if $beaconGeometry}
    {#each positions as [position, color]}
        <T
            is={new THREE.Mesh($beaconGeometry, color == Color.Red ? RED_CONE_MAT : BLUE_CONE_MAT)}
            {position}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={[0.15 * INCH_TO_METER, 0.15 * INCH_TO_METER, 0.15 * INCH_TO_METER]}
        />
    {/each}
{/if}
