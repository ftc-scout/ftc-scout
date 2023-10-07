<script lang="ts" context="module">
    export const EPSILON = 0.01;
</script>

<script lang="ts">
    import { T } from "@threlte/core";
    import * as THREE from "three";
    import { INCH_TO_METER, TILE_SIZE, fPos3 } from "./Field.svelte";

    export let start: [number, number];
    export let end: [number, number];
    export let width = 2;
    export let height = EPSILON * 2;
    export let color: string;

    $: dx = end[0] - start[0];
    $: dy = end[1] - start[1];
    $: length = Math.sqrt(dx * dx + dy * dy);
    $: mid = [start[0] + dx / 2, start[1] + dy / 2];
    $: angle = Math.PI / 2 - Math.atan2(dy, dx);
</script>

<T.Mesh position={fPos3(mid[0], mid[1])} rotation={[0, angle, 0]}>
    <T.BoxGeometry
        args={[width * INCH_TO_METER, height * INCH_TO_METER, length * TILE_SIZE * INCH_TO_METER]}
    />
    <T
        is={new THREE.MeshStandardMaterial({ color })}
        clippingPlanes={[
            new THREE.Plane(new THREE.Vector3(1, 0, 0), 24 * 3 * INCH_TO_METER),
            new THREE.Plane(new THREE.Vector3(-1, 0, 0), 24 * 3 * INCH_TO_METER),
            new THREE.Plane(new THREE.Vector3(0, 0, 1), 24 * 3 * INCH_TO_METER),
            new THREE.Plane(new THREE.Vector3(0, 0, -1), 24 * 3 * INCH_TO_METER),
        ]}
    />
</T.Mesh>
