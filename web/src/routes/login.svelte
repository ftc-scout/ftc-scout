<script lang="ts">
    import { goto } from "$app/navigation";
    import { mutation } from "@urql/svelte";
    import { writable, type Writable } from "svelte/store";
    import Form from "../lib/components/form/Form.svelte";
    import type { FormError } from "../lib/components/form/FormError";
    import SubmitButton from "../lib/components/form/SubmitButton.svelte";
    import TextInput from "../lib/components/form/TextInput.svelte";
    import MaxWidth from "../lib/components/MaxWidth.svelte";
    import { LoginDocument } from "../lib/graphql/generated/graphql-operations";

    let username: string = "";
    let password: string = "";

    let canSubmit = writable(true);
    $: $canSubmit = !!username.length && !!password.length;

    let errors: Writable<FormError[]> = writable([]);

    const loginMutation = mutation({ query: LoginDocument });

    async function login() {
        const response = (await loginMutation({ username, password })).data
            ?.login;
        if (response?.errors) {
            $errors = response?.errors;
        } else {
            goto("/");
        }
    }
</script>

<svelte:head>
    <title>FTC Scout - Login</title>
</svelte:head>

<MaxWidth width="30em">
    <Form {errors} {canSubmit} on:submit={login}>
        <h1>Login</h1>

        <TextInput
            label="Username"
            placeholder="username"
            bind:value={username}
        />

        <TextInput
            label="Password"
            placeholder="password"
            password
            bind:value={password}
        />
        <SubmitButton />
    </Form>
</MaxWidth>

<style>
    h1 {
        text-align: center;
        font-size: 1.5rem;
    }
</style>
