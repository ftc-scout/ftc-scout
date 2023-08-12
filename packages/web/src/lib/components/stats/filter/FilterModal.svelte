<script lang="ts">
    import { getFilterId, type FilterGroup, type FilterVal } from "./filter";
    import Modal from "../../Modal.svelte";
    import type { StatSet } from "../stat-table";
    import ShowFilterGroup from "./ShowFilterGroup.svelte";

    type T = $$Generic;

    export let stats: StatSet<T>;
    export let shown = false;

    let one: FilterVal = { ty: "lit", lit: 1 };

    export let root: FilterGroup = {
        ty: "or",
        children: [
            { ty: "group", id: getFilterId(), group: { ty: "and", children: [] } },
            { ty: "cond", id: getFilterId(), cond: { lhs: one, op: "<", rhs: one } },
        ],
    };
</script>

<Modal bind:shown titleText="Edit Filters" closeText="Save">
    <ShowFilterGroup {stats} group={root} />
</Modal>
