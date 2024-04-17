<script lang="ts">
    import type { AwardType } from "../graphql/generated/graphql-operations";
    import { prettyPrintAwardPlacementParts } from "../printers/award";

    export let award: {
        type: AwardType;
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
