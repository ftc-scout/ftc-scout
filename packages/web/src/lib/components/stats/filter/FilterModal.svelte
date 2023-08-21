<script lang="ts">
    import Modal from "../../Modal.svelte";
    import { emptyFiler, trimFilterGroup, type FilterGroup, type StatSet } from "@ftc-scout/common";
    import ShowFilterGroup from "./ShowFilterGroup.svelte";
    import { createEventDispatcher } from "svelte";

    type T = $$Generic;

    export let stats: StatSet<T>;
    export let shown = false;
    export let root: FilterGroup | null;

    $: editable = root ?? emptyFiler();
    $: if (shown) editable = root ?? emptyFiler();

    let dispatch = createEventDispatcher();
    function close() {
        shown = false;
        dispatch("new-filter", trimFilterGroup(editable));
    }
</script>

<Modal bind:shown titleText="Edit Filters" closeText="Save" {close}>
    <div>
        <ShowFilterGroup {stats} bind:group={editable} />
    </div>
</Modal>

<style>
    div {
        min-width: 50ch;
    }

    @media (max-width: 800px) {
        div {
            min-width: 40ch;
        }
    }
</style>
