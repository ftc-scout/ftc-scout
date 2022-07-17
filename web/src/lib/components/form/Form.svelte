<script lang="ts">
    import { setContext } from "svelte";
    import { derived, writable, type Readable, type Writable } from "svelte/store";
    import type { FormError } from "./FormError";

    export let errors: Writable<FormError[]> = writable([]);
    setContext("form-errors", errors);

    export let canSubmit: Readable<boolean> = derived(errors, ($errors) => $errors.length === 0);
    setContext("form-can-submit", canSubmit);
</script>

<form on:submit|preventDefault>
    <slot />
</form>

<style>
    form {
        padding: 0.75rem;
    }
</style>
