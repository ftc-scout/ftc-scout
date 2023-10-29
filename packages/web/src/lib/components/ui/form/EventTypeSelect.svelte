<script lang="ts">
    import type { EventTypeOption } from "@ftc-scout/common";
    import { getContext } from "svelte";
    import { FORM_ID } from "./Form.svelte";
    import { COMP_EVENT_TY_GROUPS, EVENT_TY_GROUPS, eventTyNames } from "../../../util/event-type";

    export let eventType: EventTypeOption;
    export let name: string | null = null;
    export let id: string | null = null;
    export let competitionOnly = false;
    export let style = "";

    let form = getContext(FORM_ID) as string | null;

    $: all = competitionOnly ? COMP_EVENT_TY_GROUPS : EVENT_TY_GROUPS;
</script>

<select bind:value={eventType} {form} {name} {id} on:change {style}>
    {#each all as group}
        <optgroup>
            {#each group as e}
                <option selected={eventType == e} value={e}
                    >{eventTyNames(e, competitionOnly)}</option
                >
            {/each}
        </optgroup>
    {/each}
</select>

<style>
    select {
        width: 100%;
    }
</style>
