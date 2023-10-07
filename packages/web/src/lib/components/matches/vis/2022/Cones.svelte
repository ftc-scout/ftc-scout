<script lang="ts" context="module">
    import type { BufferGeometry, InstancedMesh } from "three";
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
    import { writable, type Writable } from "svelte/store";

    let coneGeometry: Writable<BufferGeometry | null> = writable(null);
    let loaded = false;

    async function loadCone() {
        if (loaded) return;
        loaded = true;

        let loader = new GLTFLoader();
        let res: BufferGeometry = (
            (await loader.loadAsync("/models/PPCone.glb")).scene.children[0] as any
        ).geometry;
        res.computeVertexNormals();
        coneGeometry.set(res);
    }

    export const RED_CONE_MAT = new THREE.MeshStandardMaterial({ color: "#D00000" });
    export const BLUE_CONE_MAT = new THREE.MeshStandardMaterial({ color: "#0000A0" });
</script>

<script lang="ts">
    import { T } from "@threlte/core";
    import { onMount } from "svelte";
    import * as THREE from "three";
    import { Color } from "@ftc-scout/common";
    import { ConeType, type ConeLayout } from "../../../../graphql/generated/graphql-operations";
    import { fPos3 } from "../Field.svelte";
    import { JType, JUNCTION_TYPES } from "./PowerPlayVis.svelte";

    onMount(loadCone);

    function calcConePositions(layout: ConeLayout, color: Color): [number, number, number][] {
        const GAP = 1.25;
        const ourCone = color == Color.Red ? ConeType.RedCone : ConeType.BlueCone;

        let res: [number, number, number][] = [];

        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {
                let height = JUNCTION_TYPES[x][y] == JType.G ? 0.4 : 0;
                for (let scoringElement of layout.junctions[x][y]) {
                    if (scoringElement == ourCone) {
                        res.push(fPos3(x + 1, y + 1, height));
                    }
                    height += GAP;
                }
            }
        }

        const LOCS = [
            [0.25, 0.25],
            [5.75, 5.75],
            [5.75, 0.25],
            [0.25, 5.75],
        ];

        let counts = [
            color == Color.Red ? layout.redNearTerminal : 0,
            color == Color.Red ? layout.redFarTerminal : 0,
            color == Color.Blue ? layout.blueNearTerminal : 0,
            color == Color.Blue ? layout.blueFarTerminal : 0,
        ];

        for (let i = 0; i < LOCS.length; i++) {
            let height = 0;
            for (let j = 0; j < counts[i]; j++) {
                res.push(fPos3(LOCS[i][0], LOCS[i][1], height));
                height += GAP;
            }
        }

        return res;
    }

    export let color: Color;
    $: material = color == Color.Red ? RED_CONE_MAT : BLUE_CONE_MAT;

    export let cones: ConeLayout;
    $: positions = calcConePositions(cones, color);

    let mesh: InstancedMesh;
    $: if ($coneGeometry) {
        const dummy = new THREE.Object3D();
        mesh = new THREE.InstancedMesh($coneGeometry, material, 80);
        mesh.count = positions.length;
        for (let i = 0; i < positions.length; i++) {
            dummy.position.set(positions[i][0], positions[i][1], positions[i][2]);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
        }
    }
</script>

{#if $coneGeometry}
    <T is={mesh} />
{/if}

<!-- 
{#if $cone}
    <T is={$cone.scene} />
{/if} -->
