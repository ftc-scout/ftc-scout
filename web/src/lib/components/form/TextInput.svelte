<script lang="ts">
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import type { FormError } from "./FormError";

    export let label: string;
    export let placeholder: string = "";
    export let id: string = label.toLocaleLowerCase().replace(/\s/g, "");
    export let password: boolean = false;

    export let value: string;

    let errorsStore: Writable<FormError[]> = getContext("form-errors");
    $: myErrors = $errorsStore.filter((e) => e.field.toLocaleLowerCase() === id);
</script>

<label for={id}>
    {label}
    {#if password}
        <input {id} type="password" bind:value {placeholder} class:error={myErrors.length} />
    {:else}
        <input {id} type="text" bind:value {placeholder} class:error={myErrors.length} />
    {/if}

    {#each myErrors as error}
        <p>{error.message}</p>
    {/each}
</label>

<style>
    * {
        font-size: 1rem;
    }

    p {
        color: red;
        margin-top: 0.25rem;
    }

    label {
        display: block;
        width: 100%;

        font-size: 1rem;
        font-weight: 500;

        margin-inline-end: 0.75rem;
        margin-bottom: 1rem;
    }

    input {
        display: block;
        width: 100%;
        height: 2.5rem;

        box-sizing: border-box;
        padding-inline-start: 1em;

        border-radius: 0.375rem;
        border: 1px solid rgb(226, 232, 240);

        margin-top: 0.5rem;
    }

    input:focus-visible {
        outline: var(--theme-color) solid 2px;
    }

    input.error {
        outline: red solid 2px;
    }
</style>
