<script lang="ts">
    import * as THREE from "three";
    import * as SC from "svelte-cubed";
    import { EPSILON } from "./PowerPlayVisModal.svelte";

    export let start: [number, number];
    export let end: [number, number];
    export let width = 2;
    export let height = EPSILON * 2;
    export let material: THREE.Material;

    const PLANES = [
        new THREE.Plane(new THREE.Vector3(1, 0, 0), 24 * 3),
        new THREE.Plane(new THREE.Vector3(-1, 0, 0), 24 * 3),
        new THREE.Plane(new THREE.Vector3(0, 0, 1), 24 * 3),
        new THREE.Plane(new THREE.Vector3(0, 0, -1), 24 * 3),
    ];

    $: clippedMat = (() => {
        let m = material.clone();
        m.clippingPlanes = PLANES;
        return m;
    })();

    $: dx = end[0] - start[0];
    $: dy = end[1] - start[1];
    $: length = Math.sqrt(dx * dx + dy * dy);
    $: midpoint = [start[0] + dx / 2, start[1] + dy / 2];
    $: rot = Math.PI / 2 - Math.atan2(dy, dx);
</script>

<SC.Mesh
    geometry={new THREE.BoxGeometry(width, height, length)}
    position={[midpoint[0], height / 2, midpoint[1]]}
    material={clippedMat}
    rotation={[0, rot, 0]}
/>
