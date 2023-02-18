<script lang="ts">
    import * as THREE from "three";
    import * as SC from "svelte-cubed";
    import type { Position } from "svelte-cubed/types/common";
    import FieldLine from "./FieldLine.svelte";
    import type { Material } from "three";
    import Cone from "./Cone.svelte";

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

    const RED_CONE_MAT = new THREE.MeshStandardMaterial({ color: "#D00000" });
    const BLUE_CONE_MAT = new THREE.MeshStandardMaterial({ color: "#0000A0" });

    // Z(1->2->3->4->5)->Y(1->2->etc.)

    const EPSILON = 0.01;

    type Junction = "G" | "L" | "M" | "H";
    type Cone = "R" | "B";

    const JUNCTION_HEIGHTS: Record<Junction, number> = {
        G: 0.56,
        L: 13.5,
        M: 23.5,
        H: 33.5,
    };

    function poleType(x: number, y: number): Junction {
        return (
            [
                ["G", "L", "G", "L", "G"],
                ["L", "M", "H", "M", "L"],
                ["G", "H", "G", "H", "G"],
                ["L", "M", "H", "M", "L"],
                ["G", "L", "G", "L", "G"],
            ] as const
        )[x][y];
    }

    function fieldPoint2(x: number, y: number): [number, number] {
        return [(x - 2) * 24, (y - 2) * 24];
    }

    function fieldPoint(x: number, y: number, height: number = 0): Position {
        return [(x - 2) * 24, height, (y - 2) * 24];
    }

    function calcConePositions(cones: Cone[][][]): [[number, number, number][], [number, number, number][]] {
        let red: [number, number, number][] = [];
        let blue: [number, number, number][] = [];
        for (let x = 0; x < cones.length; x++) {
            for (let y = 0; y < cones[x].length; y++) {
                let height = poleType(x, y) == "G" ? 0.4 : 0;
                for (let cone of cones[x][y]) {
                    (cone == "R" ? red : blue).push(fieldPoint(x, y, height));
                    height += 1.25;
                }
            }
        }

        return [red, blue];
    }

    $: [redConePositions, blueConePositions] = calcConePositions([[["R", "R", "B", "R"], ["R"]], [], [], [], []]);
</script>

<div>
    <SC.Canvas antialias background={new THREE.Color("#ffffff")} localClippingEnabled={true}>
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
                {@const junctionType = poleType(x, y)}
                {@const junctionHeight = JUNCTION_HEIGHTS[junctionType]}

                {#if junctionType == "G"}
                    <SC.Mesh
                        geometry={new THREE.CylinderGeometry(4.25 / 2.0, 3.0, junctionHeight, 20)}
                        material={GJ_MAT}
                        position={fieldPoint(x, y, junctionHeight / 2)}
                    />
                {:else}
                    <SC.Mesh
                        geometry={new THREE.CylinderGeometry(0.4, 0.4, 3, 20)}
                        material={SPRING_MAT}
                        position={fieldPoint(x, y, 1.5)}
                    />
                    <SC.Mesh
                        geometry={new THREE.CylinderGeometry(0.5, 0.5, junctionHeight - 3, 20)}
                        material={POLE_LIST_MAT}
                        position={fieldPoint(x, y, (junctionHeight - 3) / 2 + 3)}
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
        <FieldLine
            material={RED_TAPE_MAT}
            start={[-24 * 2, -24 * 3 - Math.SQRT2]}
            end={[-24 * 3 - Math.SQRT2, -24 * 2]}
        />
        <FieldLine material={RED_TAPE_MAT} start={[24 * 2, 24 * 3 + Math.SQRT2]} end={[24 * 3 + Math.SQRT2, 24 * 2]} />
        <FieldLine
            material={BLUE_TAPE_MAT}
            start={[24 * 2, -24 * 3 - Math.SQRT2]}
            end={[24 * 3 + Math.SQRT2, -24 * 2]}
        />
        <FieldLine
            material={BLUE_TAPE_MAT}
            start={[-24 * 2, 24 * 3 + Math.SQRT2]}
            end={[-24 * 3 - Math.SQRT2, 24 * 2]}
        />

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

        <!-- Cones -->
        <Cone material={RED_CONE_MAT} positions={redConePositions} />
        <Cone material={BLUE_CONE_MAT} positions={blueConePositions} />

        <!-- Camera -->
        <SC.PerspectiveCamera position={[24 * 4, 60, 24 * 4]} />
        <SC.OrbitControls maxPolarAngle={Math.PI * 0.49} enablePan={true} />

        <!-- Lighting -->
        <SC.AmbientLight intensity={0.6} />
        <SC.DirectionalLight intensity={0.64} position={[-24, 24, 24]} />
    </SC.Canvas>
</div>

<style>
    div {
        height: 400px;
    }
</style>
