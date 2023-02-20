<script context="module" lang="ts">
    function junctionIsOwned(x: number, y: number, coneLayout: ConeLayout, ourColor: Color): boolean {
        let cones = coneLayout.junctions[x][y];
        return cones.length != 0 && cones[cones.length - 1].startsWith(ourColor);
    }

    function computeCircuit(coneLayout: ConeLayout, ourColor: Color): [number, number][] | null {
        let [tNear, tFar] =
            ourColor == "R"
                ? [coneLayout.redNearTerminal, coneLayout.redFarTerminal]
                : [coneLayout.blueNearTerminal, coneLayout.blueFarTerminal];
        if (tNear == 0 || tFar == 0) return null;

        const junctionIsOwned1 = (x: number, y: number) => junctionIsOwned(x, y, coneLayout, ourColor);

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
                .filter(([dx, dy]) => inBounds(dx, dy) && junctionIsOwned1(dx, dy));
        }

        let queue: [number, number][][] =
            ourColor == "R" ? [[[0, 0]], [[1, 0]], [[0, 1]]] : [[[4, 0]], [[3, 0]], [[4, 1]]];
        queue = queue.filter(([[x, y]]) => junctionIsOwned1(x, y));
        let ends: [number, number][] =
            ourColor == "R"
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
                return path;
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
</script>

<script lang="ts">
    import { fieldPoint, fieldPoint2 } from "./Field.svelte";
    import FieldLine from "./FieldLine.svelte";
    import * as THREE from "three";
    import * as SC from "svelte-cubed";
    import type { Color } from "./PowerPlayVisModal.svelte";
    import type { ConeLayout } from "../../../../graphql/generated/graphql-operations";

    const EPSILON = 0.01;

    export let layout: ConeLayout;
    export let ourColor: Color;

    $: nearTermPos = ourColor == "R" ? [-0.75, -0.75] : [4.75, -0.75];
    $: farTermPos = ourColor == "R" ? [4.75, 4.75] : [-0.75, 4.75];
    $: tNear = ourColor == "R" ? layout.redNearTerminal : layout.blueNearTerminal;
    $: tFar = ourColor == "R" ? layout.redFarTerminal : layout.blueFarTerminal;

    $: path = computeCircuit(layout, ourColor);
    $: terminalPath = path ? [nearTermPos, ...path, farTermPos] : null;

    $: material = new THREE.MeshStandardMaterial({ color: ourColor == "R" ? "#BB0000" : "#0000BB" });

    function windows<T>(arr: T[]): [T, T][] {
        let res: [T, T][] = [];
        for (let i = 0; i + 1 < arr.length; i++) {
            res.push([arr[i], arr[i + 1]]);
        }
        return res;
    }
</script>

{#if terminalPath}
    {#each windows(terminalPath) as p}
        <FieldLine
            {material}
            start={fieldPoint2(p[0][0], p[0][1])}
            end={fieldPoint2(p[1][0], p[1][1])}
            height={EPSILON * 3}
        />
    {/each}
{/if}

{#each [...Array(5).keys()] as x}
    {#each [...Array(5).keys()] as y}
        {#if junctionIsOwned(x, y, layout, ourColor)}
            <SC.Mesh
                geometry={new THREE.RingGeometry(3, 4.5)}
                position={fieldPoint(x, y, EPSILON * 1.25)}
                rotation={[-Math.PI / 2, 0, 0]}
                {material}
            />
        {/if}
    {/each}
{/each}

{#if tNear}
    <SC.Mesh
        geometry={new THREE.RingGeometry(3, 4.5)}
        position={fieldPoint(nearTermPos[0], nearTermPos[1], EPSILON * 1.25)}
        rotation={[-Math.PI / 2, 0, 0]}
        {material}
    />
{/if}

{#if tFar}
    <SC.Mesh
        geometry={new THREE.RingGeometry(3, 4.5)}
        position={fieldPoint(farTermPos[0], farTermPos[1], EPSILON * 1.25)}
        rotation={[-Math.PI / 2, 0, 0]}
        {material}
    />
{/if}
