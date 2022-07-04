<script lang="ts">
    import type { AwardTypes2021 } from "../graphql/generated/graphql-operations";
    import { prettyPrintAwardPlacementParts } from "../util/format/pretty-print-award";

    export let award: {
        type: AwardTypes2021;
        placement: number;
        personName?: string | null;
    };
    export let comma: boolean;

    $: [typeName, placement] = prettyPrintAwardPlacementParts(
        award.type,
        award.placement,
        award.personName ?? null
    );
</script>

<b>{typeName}</b>
{placement + (comma ? ", " : "")}
