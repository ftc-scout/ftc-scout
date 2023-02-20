<script context="module" lang="ts">
    export function fieldPoint2(x: number, y: number): [number, number] {
        return [(x - 2) * 24, (y - 2) * 24];
    }

    export function fieldPoint(x: number, y: number, height: number = 0): Position {
        return [(x - 2) * 24, height, (y - 2) * 24];
    }
</script>

<script lang="ts">
    import * as THREE from "three";
    import * as SC from "svelte-cubed";
    import type { Position } from "svelte-cubed/types/common";
    import FieldLine from "./FieldLine.svelte";
    import type { Material } from "three";
    import { EPSILON, junctionHeight, junctionType } from "./PowerPlayVisModal.svelte";

    const RED_C = "#FF0000";
    const BLUE_C = "#0000FF";

    const FIELD_MAT = new THREE.MeshStandardMaterial({ color: "#c6c6c6" });
    const FIELD_MARK_MAT = new THREE.MeshStandardMaterial({ color: "#535353" });
    const RED_TAPE_MAT = new THREE.MeshStandardMaterial({ color: RED_C });
    const BLUE_TAPE_MAT = new THREE.MeshStandardMaterial({ color: BLUE_C });
    const GJ_MAT = new THREE.MeshStandardMaterial({ color: "#393939" });
    const POLE_LIST_MAT = [new THREE.MeshStandardMaterial({ color: "#FFB839" }), GJ_MAT, GJ_MAT] as unknown as Material;
    const SPRING_MAT = new THREE.MeshPhysicalMaterial({
        color: "#C0C0C0",
        roughness: 0,
    });
</script>

<!-- Field -->
<SC.Mesh geometry={new THREE.BoxGeometry(24 * 6, 1.0, 24 * 6)} material={FIELD_MAT} position={[0, -0.5, 0]} />
{#each [...Array(5).keys()] as i}
    <FieldLine
        start={fieldPoint2(i, -1)}
        end={fieldPoint2(i, 5)}
        material={FIELD_MARK_MAT}
        width={0.175}
        height={EPSILON}
    />
    <FieldLine
        start={fieldPoint2(-1, i)}
        end={fieldPoint2(5, i)}
        material={FIELD_MARK_MAT}
        width={0.175}
        height={EPSILON}
    />
{/each}

<!-- Junctions -->
{#each [...Array(5).keys()] as x}
    {#each [...Array(5).keys()] as y}
        {@const type = junctionType(x, y)}
        {@const height = junctionHeight(x, y)}

        {#if type == "G"}
            <SC.Mesh
                geometry={new THREE.CylinderGeometry(4.25 / 2.0, 3.0, height, 20)}
                material={GJ_MAT}
                position={fieldPoint(x, y, height / 2)}
            />
        {:else}
            <SC.Mesh
                geometry={new THREE.CylinderGeometry(0.4, 0.4, 3, 20)}
                material={SPRING_MAT}
                position={fieldPoint(x, y, 1.5)}
            />
            <SC.Mesh
                geometry={new THREE.CylinderGeometry(0.5, 0.5, height - 3, 20)}
                material={POLE_LIST_MAT}
                position={fieldPoint(x, y, (height - 3) / 2 + 3)}
            />
        {/if}
    {/each}
{/each}

<!-- Tape -->
<!-- Stack tape -->
<FieldLine material={RED_TAPE_MAT} start={[-12.5, -24 * 3]} end={[-12.5, -24 * 2]} />
<FieldLine material={BLUE_TAPE_MAT} start={[12.5, -24 * 3]} end={[12.5, -24 * 2]} />
<FieldLine material={RED_TAPE_MAT} start={[-12.5, 24 * 3]} end={[-12.5, 24 * 2]} />
<FieldLine material={BLUE_TAPE_MAT} start={[12.5, 24 * 3]} end={[12.5, 24 * 2]} />

<!-- Terminals -->
<FieldLine material={RED_TAPE_MAT} start={[-24 * 2, -24 * 3 - Math.SQRT2]} end={[-24 * 3 - Math.SQRT2, -24 * 2]} />
<FieldLine material={RED_TAPE_MAT} start={[24 * 2, 24 * 3 + Math.SQRT2]} end={[24 * 3 + Math.SQRT2, 24 * 2]} />
<FieldLine material={BLUE_TAPE_MAT} start={[24 * 2, -24 * 3 - Math.SQRT2]} end={[24 * 3 + Math.SQRT2, -24 * 2]} />
<FieldLine material={BLUE_TAPE_MAT} start={[-24 * 2, 24 * 3 + Math.SQRT2]} end={[-24 * 3 - Math.SQRT2, 24 * 2]} />

<!-- Substations -->
<FieldLine
    material={RED_TAPE_MAT}
    start={[-24 * 2.5 + Math.SQRT1_2, Math.SQRT1_2]}
    end={[-24 * 3 - Math.SQRT2, -12 - Math.SQRT2]}
/>
<FieldLine material={RED_TAPE_MAT} start={[-24 * 2.5, 0]} end={[-24 * 3 - Math.SQRT2, 12 + Math.SQRT2]} />
<FieldLine
    material={BLUE_TAPE_MAT}
    start={[24 * 2.5 + Math.SQRT1_2, Math.SQRT1_2]}
    end={[24 * 3 + Math.SQRT2, -12 - Math.SQRT2]}
/>
<FieldLine material={BLUE_TAPE_MAT} start={[24 * 2.5, 0]} end={[24 * 3 + Math.SQRT2, 12 + Math.SQRT2]} />
