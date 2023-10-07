<script lang="ts">
    import { T } from "@threlte/core";
    import { JType, JUNCTION_HEIGHTS, JUNCTION_TYPES } from "./PowerPlayVis.svelte";
    import * as THREE from "three";
    import { INCH_TO_METER, fPos3 } from "../Field.svelte";

    const GJ_MAT = new THREE.MeshStandardMaterial({ color: "#393939" });
    const POLE_LIST_MAT = [new THREE.MeshStandardMaterial({ color: "#FFB839" }), GJ_MAT, GJ_MAT];
    const SPRING_MAT = new THREE.MeshPhysicalMaterial({
        color: "#C0C0C0",
        roughness: 0,
    });

    new THREE.Mesh();
</script>

{#each [...Array(5).keys()] as x}
    {#each [...Array(5).keys()] as y}
        {@const type = JUNCTION_TYPES[x][y]}
        {@const height = JUNCTION_HEIGHTS[type]}

        {#if type == JType.G}
            <T.Mesh position={fPos3(x + 1, y + 1, height / 2)}>
                <T.CylinderGeometry
                    args={[
                        (4.25 / 2.0) * INCH_TO_METER,
                        3.0 * INCH_TO_METER,
                        height * INCH_TO_METER,
                        20,
                    ]}
                />
                <T is={GJ_MAT} />
            </T.Mesh>
        {:else}
            <T.Mesh position={fPos3(x + 1, y + 1, 1.5)}>
                <T.CylinderGeometry
                    args={[0.4 * INCH_TO_METER, 0.4 * INCH_TO_METER, 3 * INCH_TO_METER, 20]}
                />
                <T is={SPRING_MAT} />
            </T.Mesh>
            <T.Mesh
                position={fPos3(x + 1, y + 1, (height - 3) / 2 + 3)}
                args={[
                    new THREE.CylinderGeometry(
                        0.5 * INCH_TO_METER,
                        0.5 * INCH_TO_METER,
                        (height - 3) * INCH_TO_METER,
                        20
                    ),
                    POLE_LIST_MAT,
                ]}
            />
        {/if}

        {type}
        {height}
    {/each}
{/each}
