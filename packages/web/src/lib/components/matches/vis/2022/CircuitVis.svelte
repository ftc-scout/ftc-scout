<script lang="ts">
    import { Color } from "@ftc-scout/common";
    import { ConeType, type ConeLayout } from "../../../../graphql/generated/graphql-operations";
    import { T } from "@threlte/core";
    import * as THREE from "three";
    import { BLUE_COLOR, INCH_TO_METER, RED_COLOR, fPos3 } from "../Field.svelte";
    import FieldLine, { EPSILON } from "../FieldLine.svelte";
    import { windows } from "../../../../util/array";

    function isOurCone(cone: ConeType, color: Color): boolean {
        let ourColorIsRed = color == Color.Red;
        let coneIsRed =
            cone == ConeType.RedBeacon1 || cone == ConeType.RedBeacon2 || cone == ConeType.RedCone;
        return ourColorIsRed == coneIsRed;
    }

    function junctionIsOwned(x: number, y: number, cones: ConeLayout, color: Color): boolean {
        let stack = cones.junctions[x][y];
        return stack.length != 0 && isOurCone(stack[stack.length - 1], color);
    }

    function findCircuitPath(cones: ConeLayout, color: Color): [number, number][] | null {
        let tNear = color == Color.Red ? cones.redNearTerminal : cones.blueNearTerminal;
        let tFar = color == Color.Red ? cones.redFarTerminal : cones.blueFarTerminal;
        if (tNear == 0 || tFar == 0) return null;

        function inBounds(x: number, y: number): boolean {
            return x >= 0 && x <= 4 && y >= 0 && y <= 4;
        }

        function adjacent(x: number, y: number): [number, number][] {
            return [
                [1, -1],
                [1, 0],
                [1, 1],
                [0, 1],
                [-1, 1],
                [-1, 0],
                [-1, -1],
                [0, -1],
            ]
                .map(([dx, dy]) => [x + dx, y + dy] as [number, number])
                .filter(([dx, dy]) => inBounds(dx, dy) && junctionIsOwned(dx, dy, cones, color));
        }

        let queue: [number, number][][] =
            color == Color.Red ? [[[0, 0]], [[1, 0]], [[0, 1]]] : [[[4, 0]], [[3, 0]], [[4, 1]]];
        queue = queue.filter(([[x, y]]) => junctionIsOwned(x, y, cones, color));
        let ends: [number, number][] =
            color == Color.Red
                ? [
                      [4, 4],
                      [3, 4],
                      [4, 3],
                  ]
                : [
                      [0, 4],
                      [0, 3],
                      [1, 4],
                  ];

        while (queue.length != 0) {
            let path = queue.shift()!;
            let lastNode = path[path.length - 1];

            if (ends.some((e) => e[0] == lastNode[0] && e[1] == lastNode[1])) {
                return [
                    color == Color.Red ? LOCS[0] : LOCS[2],
                    ...path.map(([x, y]) => [x + 1, y + 1] as [number, number]),
                    color == Color.Red ? LOCS[1] : LOCS[3],
                ];
            }

            let nextNodes = adjacent(lastNode[0], lastNode[1]);
            // Remove already visited nodes
            nextNodes = nextNodes.filter((n) => !path.some((p) => n[0] == p[0] && n[1] == p[1]));
            for (let next of nextNodes) {
                queue.push([...path, next]);
            }
        }

        return null;
    }

    export let cones: ConeLayout;
    export let color: Color;
    $: material = new THREE.MeshStandardMaterial({
        color: color == Color.Red ? RED_COLOR : BLUE_COLOR,
    });

    const LOCS: [number, number][] = [
        [0.25, 0.25],
        [5.75, 5.75],
        [5.75, 0.25],
        [0.25, 5.75],
    ];

    $: counts = [
        color == Color.Red ? !!cones.redNearTerminal : false,
        color == Color.Red ? !!cones.redFarTerminal : false,
        color == Color.Blue ? !!cones.blueNearTerminal : false,
        color == Color.Blue ? !!cones.blueFarTerminal : false,
    ];

    $: circuitPath = findCircuitPath(cones, color);
    $: circuitPathWithTerminals = circuitPath ? [...circuitPath] : null;
</script>

{#each [...Array(5).keys()] as x}
    {#each [...Array(5).keys()] as y}
        {#if junctionIsOwned(x, y, cones, color)}
            <T.Mesh position={fPos3(x + 1, y + 1, EPSILON)} rotation={[-Math.PI / 2, 0, 0]}>
                <T.RingGeometry args={[3 * INCH_TO_METER, 4.5 * INCH_TO_METER]} />
                <T is={material} />
            </T.Mesh>
        {/if}
    {/each}
{/each}

{#each LOCS as [x, y], i}
    {#if counts[i]}
        <T.Mesh position={fPos3(x, y, EPSILON)} rotation={[-Math.PI / 2, 0, 0]}>
            <T.RingGeometry args={[3 * INCH_TO_METER, 4.5 * INCH_TO_METER]} />
            <T is={material} />
        </T.Mesh>
    {/if}
{/each}

{#if circuitPathWithTerminals}
    {#each windows(circuitPathWithTerminals) as [start, end]}
        <FieldLine
            {start}
            {end}
            color={color == Color.Red ? RED_COLOR : BLUE_COLOR}
            height={EPSILON * 3}
        />
    {/each}
{/if}
