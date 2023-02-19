<script context="module" lang="ts">
    import type { BufferGeometry } from "three";
    import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
    import { writable, type Writable } from "svelte/store";

    let beaconGeometry: Writable<BufferGeometry | null> = writable(null);
    let loading = false;

    async function loadBeacon() {
        if (!loading) {
            loading = true;
            let loader = new STLLoader();
            beaconGeometry.set(await loader.loadAsync("/models/Beacon.stl"));
        }
    }
</script>

<script lang="ts">
    import { onMount } from "svelte";
    import * as SC from "svelte-cubed";
    import { BLUE_CONE_MAT, junctionHeight, RED_CONE_MAT, type Color, type ConeLayout } from "./PowerPlayVis.svelte";
    import { fieldPoint } from "./Field.svelte";

    onMount(loadBeacon);

    function findPositions(layout: ConeLayout): [number, number, Color][] {
        let positions = [];
        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {
                for (let scoringElement of layout.junctions[x][y]) {
                    if (scoringElement.includes("Beacon")) {
                        positions.push([x, y, scoringElement[0]] as [number, number, Color]);
                    }
                }
            }
        }
        return positions;
    }

    let spin = 0;
    // SC.onFrame(() => spin += 0.015);

    export let layout: ConeLayout;
    $: positions = findPositions(layout);
</script>

{#if $beaconGeometry}
    {#each positions as [x, y, color]}
        <SC.Mesh
            geometry={$beaconGeometry}
            material={color == "R" ? RED_CONE_MAT : BLUE_CONE_MAT}
            rotation={[-Math.PI / 2, 0, spin]}
            scale={[0.15, 0.15, 0.15]}
            position={fieldPoint(x, y, junctionHeight(x, y) - 2.5)}
        />
    {/each}
{/if}
