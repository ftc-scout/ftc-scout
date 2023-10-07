<script lang="ts">
    import { interactivity } from "@threlte/extras";
    import { JUNCTION_HEIGHTS, JUNCTION_TYPES } from "./PowerPlayVis.svelte";
    import { INCH_TO_METER, fPos3 } from "../Field.svelte";
    import { T, useFrame, useThrelte } from "@threlte/core";
    import type { ConeLayout } from "../../../../graphql/generated/graphql-operations";

    export let cones: ConeLayout;
    export let hoverPos: [number, number] | null = null;
    export let hoverJunction: number | null = null;

    interactivity({
        // Only return the first hit
        filter: (hits) => hits.slice(0, 1),
    });

    let ctx = useThrelte();
    $: size = ctx.size;
    $: camera = ctx.camera;

    let target: THREE.Object3D | null = null;

    function updatePosition() {
        if (!target) return;

        let position = target.position.clone();
        position.project($camera);
        let screenX = 0.5 * ((position.x + 1) * $size.width);
        let screenY = 0.5 * ((-position.y + 1) * $size.height);
        hoverPos = [screenX, screenY];
        hoverJunction = target.userData.junctionNumber;
    }

    function handleHit(e: { object: THREE.Object3D; camera: THREE.Camera }) {
        target = e.object;
        updatePosition();
    }

    function handleOut() {
        target = null;
        hoverPos = null;
    }

    useFrame(updatePosition);

    const LOCS: [number, number][] = [
        [0.25, 0.25],
        [5.75, 5.75],
        [5.75, 0.25],
        [0.25, 5.75],
    ];

    let counts = [
        cones.redNearTerminal,
        cones.redFarTerminal,
        cones.blueNearTerminal,
        cones.blueFarTerminal,
    ];
</script>

{#each [...Array(5).keys()] as x}
    {#each [...Array(5).keys()] as y}
        {@const type = JUNCTION_TYPES[x][y]}
        {@const junctionHeight = JUNCTION_HEIGHTS[type]}
        {@const height = Math.max(junctionHeight, cones.junctions[x][y].length * 1.25 + 2.75)}

        <T.Mesh
            position={fPos3(x + 1, y + 1, height / 2)}
            visible={false}
            userData.junctionNumber={x * 5 + y}
            on:pointerenter={handleHit}
            on:pointerleave={handleOut}
        >
            <T.CylinderGeometry
                args={[3 * INCH_TO_METER, 3 * INCH_TO_METER, height * INCH_TO_METER, 20]}
            />
        </T.Mesh>
    {/each}
{/each}

{#each LOCS as [x, y], i}
    {@const height = counts[i] * 1.25 + 3.75}
    {#if counts[i]}
        <T.Mesh
            position={fPos3(x, y, height / 2)}
            visible={false}
            userData.junctionNumber={-i - 1}
            on:pointerenter={handleHit}
            on:pointerleave={handleOut}
        >
            <T.CylinderGeometry
                args={[3 * INCH_TO_METER, 3 * INCH_TO_METER, height * INCH_TO_METER, 20]}
            />
        </T.Mesh>
    {/if}
{/each}
