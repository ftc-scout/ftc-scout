<script lang="ts" context="module">
    export const INCH_TO_METER = 0.0254;
    export const TILE_SIZE = 24;
    export const TILE_CNT = 6;

    export const RED_COLOR = "#FF0000";
    export const BLUE_COLOR = "#0000FF";

    export function fPos2(x: number, y: number): [number, number] {
        return [(x - 3) * TILE_SIZE * INCH_TO_METER, (y - 3) * TILE_SIZE * INCH_TO_METER];
    }

    export function fPos3(x: number, y: number, z: number = 0): [number, number, number] {
        return [
            (x - 3) * TILE_SIZE * INCH_TO_METER,
            z * INCH_TO_METER,
            (y - 3) * TILE_SIZE * INCH_TO_METER,
        ];
    }

    export function fSize3(x: number, y: number, z: number): [number, number, number] {
        return [x * TILE_SIZE * INCH_TO_METER, z * INCH_TO_METER, y * TILE_SIZE * INCH_TO_METER];
    }
</script>

<script lang="ts">
    import { T } from "@threlte/core";
    import FieldLine, { EPSILON } from "./FieldLine.svelte";
    import * as THREE from "three";
    import EnableLocalClipping from "./EnableLocalClipping.svelte";

    const FIELD_COLOR = new THREE.Color("#c6c6c6");
    const FIELD_MARK_COLOR = "#535353";
</script>

<EnableLocalClipping />

<T.Mesh position={[0, -0.5 * INCH_TO_METER, 0]}>
    <T.BoxGeometry args={fSize3(TILE_CNT, TILE_CNT, 1.0)} />
    <T is={new THREE.MeshStandardMaterial({ color: FIELD_COLOR })} />
</T.Mesh>

{#each [...Array(5).keys()] as i}
    <FieldLine
        start={[i + 1, 0]}
        end={[i + 1, 6]}
        color={FIELD_MARK_COLOR}
        width={0.175}
        height={EPSILON}
    />
    <FieldLine
        start={[0, i + 1]}
        end={[6, i + 1]}
        color={FIELD_MARK_COLOR}
        width={0.175}
        height={EPSILON}
    />
{/each}

<!-- Lighting -->
<T.AmbientLight intensity={0.25 * Math.PI} />
<T.DirectionalLight intensity={0.64 * Math.PI} position={fPos3(2, 4, 24)} />
<T.DirectionalLight intensity={0.64 * Math.PI} position={fPos3(4, 2, 24)} />
