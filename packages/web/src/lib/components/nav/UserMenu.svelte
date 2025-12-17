<script lang="ts">
    import { browser } from "$app/environment";
    import { onMount } from "svelte";
    import { faUser, faSignInAlt, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";

    let user: { id: number; username: string; canClipVideos: boolean } | null = null;

    onMount(() => {
        if (browser) {
            const userStr = localStorage.getItem("user");
            if (userStr) {
                try {
                    user = JSON.parse(userStr);
                } catch (e) {
                    localStorage.removeItem("user");
                }
            }
        }
    });

    async function logout() {
        try {
            await fetch(`http://${import.meta.env.PUBLIC_SERVER_ORIGIN}/graphql`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Ftcscout-Code": import.meta.env.PUBLIC_FRONTEND_CODE,
                },
                credentials: "include",
                body: JSON.stringify({
                    query: `mutation { logout }`,
                }),
            });
        } catch (e) {
            console.error("Logout error:", e);
        }

        if (browser) {
            localStorage.removeItem("user");
        }
        user = null;
    }
</script>

{#if user}
    <div class="user-menu">
        <Fa icon={faUser} />
        <span class="username">{user.username}</span>
        <button on:click={logout} class="logout-btn">
            <Fa icon={faSignOutAlt} />
        </button>
    </div>
{:else}
    <a href="/login" class="login-link">
        <Fa icon={faSignInAlt} />
        <span>Login</span>
    </a>
{/if}

<style>
    .user-menu {
        display: flex;
        align-items: center;
        gap: var(--sm-gap);
        color: var(--text-color);
    }

    .username {
        font-weight: 600;
    }

    .logout-btn {
        background: transparent;
        border: none;
        color: var(--text-color);
        cursor: pointer;
        padding: var(--sm-pad);
        display: flex;
        align-items: center;
    }

    .logout-btn:hover {
        opacity: 0.7;
    }

    .login-link {
        display: flex;
        align-items: center;
        gap: var(--sm-gap);
        color: var(--text-color);
        text-decoration: none;
        padding: var(--sm-pad);
    }

    .login-link:hover {
        opacity: 0.7;
    }
</style>
