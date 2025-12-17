<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
    import Head from "$lib/components/Head.svelte";
    import { goto } from "$app/navigation";
    import { browser } from "$app/environment";

    let username = "";
    let password = "";
    let error = "";
    let loading = false;

    async function handleLogin() {
        error = "";
        loading = true;

        try {
            const response = await fetch(`http://${import.meta.env.PUBLIC_SERVER_ORIGIN}/graphql`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Ftcscout-Code": import.meta.env.PUBLIC_FRONTEND_CODE,
                },
                credentials: "include",
                body: JSON.stringify({
                    query: `
                        mutation Login($username: String!, $password: String!) {
                            login(username: $username, password: $password) {
                                id
                                username
                                canClipVideos
                            }
                        }
                    `,
                    variables: { username, password },
                }),
            });

            const result = await response.json();

            if (result.errors) {
                error = result.errors[0]?.message || "Login failed";
            } else if (result.data?.login) {
                // Store user info in localStorage
                if (browser) {
                    localStorage.setItem("user", JSON.stringify(result.data.login));
                }
                goto("/");
            }
        } catch (e) {
            error = "Failed to connect to server";
        } finally {
            loading = false;
        }
    }
</script>

<Head title="Login - FTCScout" />

<WidthProvider>
    <Card vis={false}>
        <div class="login-container">
            <h1>Login to FTCScout</h1>
            <p>Sign in to clip match videos</p>

            <form on:submit|preventDefault={handleLogin}>
                <div class="form-group">
                    <label for="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        bind:value={username}
                        required
                        disabled={loading}
                    />
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        bind:value={password}
                        required
                        disabled={loading}
                    />
                </div>

                {#if error}
                    <div class="error">{error}</div>
                {/if}

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    </Card>
</WidthProvider>

<style>
    .login-container {
        max-width: 400px;
        margin: 0 auto;
        padding: var(--lg-pad);
    }

    h1 {
        margin-bottom: var(--sm-gap);
        color: var(--text-color);
    }

    p {
        margin-bottom: var(--lg-gap);
        color: var(--text-color);
    }

    .form-group {
        margin-bottom: var(--md-gap);
    }

    label {
        display: block;
        margin-bottom: var(--sm-gap);
        font-weight: 600;
        color: var(--text-color);
    }

    input {
        width: 100%;
        padding: var(--sm-pad);
        border: 1px solid var(--sep-color);
        border-radius: 4px;
        background: var(--bg-color);
        color: var(--text-color);
        font-size: 16px;
    }

    input:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    button {
        width: 100%;
        padding: var(--sm-pad);
        background: var(--red-team-color);
        color: white;
        border: none;
        border-radius: 4px;
        font-weight: 600;
        font-size: 16px;
        cursor: pointer;
    }

    button:hover:not(:disabled) {
        opacity: 0.9;
    }

    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .error {
        padding: var(--sm-pad);
        background: rgba(255, 0, 0, 0.1);
        border: 1px solid rgba(255, 0, 0, 0.3);
        border-radius: 4px;
        color: var(--red-team-color);
        margin-bottom: var(--md-gap);
    }
</style>
