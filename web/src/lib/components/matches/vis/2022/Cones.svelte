<script context="module" lang="ts">
    import type { BufferGeometry, InstancedMesh } from "three";
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
    import { fieldPoint } from "./Field.svelte";
    import { BLUE_CONE_MAT, junctionType, RED_CONE_MAT, type Color, type ConeLayout } from "./PowerPlayVis.svelte";

    onMount(loadCone);

    function calcConePositions(layout: ConeLayout, ourColor: Color): [number, number, number][] {
        const GAP = 1.25;

        let cones: [number, number, number][] = [];
        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {
                let height = junctionType(x, y) == "G" ? 0.4 : 0;
                for (let scoringElement of layout.junctions[x][y]) {
                    if (scoringElement.startsWith(ourColor) && scoringElement.includes("Cone")) {
                        cones.push(fieldPoint(x, y, height));
                    }
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

    export let layout: ConeLayout;
    export let ourColor: Color;
    $: material = ourColor == "R" ? RED_CONE_MAT : BLUE_CONE_MAT;
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
