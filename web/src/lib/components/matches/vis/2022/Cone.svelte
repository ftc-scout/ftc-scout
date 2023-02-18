<script context="module" lang="ts">
    import type { BufferGeometry, InstancedMesh, Material } from "three";
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
    import { writable, type Writable } from "svelte/store";

    let coneGeometry: Writable<BufferGeometry | null> = writable(null);
    let loading = false;

    async function loadCone() {
        if (!loading) {
            loading = true;
            let loader = new GLTFLoader();
            let res: BufferGeometry = ((await loader.loadAsync("/models/PPCone.glb")).scene.children[0] as any)
                .geometry;
            res.computeVertexNormals();
            coneGeometry.set(res);
        }
    }
</script>

<script lang="ts">
    import { onMount } from "svelte";
    import * as SC from "svelte-cubed";
    import * as THREE from "three";

    onMount(loadCone);

    export let material: Material;
    export let positions: [number, number, number][];

    let mesh: InstancedMesh;
    $: if ($coneGeometry) {
        const dummy = new THREE.Object3D();
        const count = 60;
        mesh = new THREE.InstancedMesh($coneGeometry, material, count);
        mesh.count = positions.length;
        for (let i = 0; i < positions.length; i++) {
            dummy.position.set(positions[i][0] / 39.4, (positions[i][1] - 2.5) / 39.4, positions[i][2] / 39.4);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
        }
    }
</script>

{#if $coneGeometry}
    <!-- scale={[39.4, 39.4, 39.4]} -->
    <SC.Primitive object={mesh} scale={[39.4, 39.4, 39.4]} position={[0, 2.5, 0]} />
{/if}
