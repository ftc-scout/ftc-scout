<script context="module" lang="ts">
    import type { BufferGeometry, InstancedMesh, Material } from "three";
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
    import { writable, type Writable } from "svelte/store";

    let coneGeometry: Writable<BufferGeometry | null> = writable(null);
    let loading = false;

    export type Cone = "R" | "B";
    export interface ConeLayout {
        redNearTerminal: number;
        redFarTerminal: number;
        blueNearTerminal: number;
        blueFarTerminal: number;
        junctions: Cone[][][];
    }

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
    import { fieldPoint, poleType } from "./Field.svelte";

    onMount(loadCone);

    function calcConePositions(layout: ConeLayout, ourColor: Cone): [number, number, number][] {
        const GAP = 1.25;

        let cones: [number, number, number][] = [];
        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {
                let height = poleType(x, y) == "G" ? 0.4 : 0;
                for (let cone of layout.junctions[x][y]) {
                    if (cone == ourColor) cones.push(fieldPoint(x, y, height));
                    height += GAP;
                }
            }
        }

        let [tNear, tFar] =
            ourColor == "R"
                ? [layout.redNearTerminal, layout.redFarTerminal]
                : [layout.blueNearTerminal, layout.blueFarTerminal];
        let [posNear, posFar] =
            ourColor == "R"
                ? [
                      [-0.75, -0.75],
                      [4.75, 4.75],
                  ]
                : [
                      [4.75, -0.75],
                      [-0.75, 4.75],
                  ];
        let height = 0;
        for (let i = 0; i < tNear; i++) {
            cones.push(fieldPoint(posNear[0], posNear[1], height));
            height += GAP;
        }
        height = 0;
        for (let i = 0; i < tFar; i++) {
            cones.push(fieldPoint(posFar[0], posFar[1], height));
            height += GAP;
        }

        return cones;
    }

    export let material: Material;
    export let layout: ConeLayout;
    export let ourColor: Cone;
    $: positions = calcConePositions(layout, ourColor);

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
