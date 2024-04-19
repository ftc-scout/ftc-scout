<script lang="ts" context="module">
    function loadAlertPreference(): "show" | "hide" {
        if (!browser) return "hide";
        let parsed = parse(document.cookie)[ALERT_COOKIE_NAME];
        return parsed == undefined ? "show" : "hide";
    }

    export let theme = writable(loadAlertPreference());
</script>

<script lang="ts">
    import { serialize, parse } from "cookie";
    import { writable } from "svelte/store";
    import Fa from "svelte-fa";
    import { faClose, faArrowRight, faWarning } from "@fortawesome/free-solid-svg-icons";
    import { ALERT_COOKIE_AGE, ALERT_COOKIE_NAME } from "../../constants";
    import { browser } from "$app/environment";

    export let message: string;
    export let link: string | null = null;

    function hide() {
        $theme = "hide";
        document.cookie = serialize(ALERT_COOKIE_NAME, "hide", {
            path: "/",
            maxAge: ALERT_COOKIE_AGE,
            httpOnly: false,
        });
    }
</script>

<div class="wrap" class:show={$theme == "show"}>
    <div><Fa icon={faWarning} /> {message}</div>

    <div>
        {#if link}
            <a href={link} target="_blank" rel="noopener noreferrer">
                <Fa icon={faArrowRight} fw size="1.5x" />
            </a>
        {/if}
        <button on:click={hide}>
            <Fa icon={faClose} fw size="1.5x" />
        </button>
    </div>
</div>

<style>
    .wrap {
        display: none;
        align-items: center;
        justify-content: space-between;
        gap: var(--md-gap);
        padding: var(--md-pad) var(--lg-pad);

        background: var(--alert-bar-color);
        font-size: var(--lg-font-size);
        font-weight: bold;

        border-radius: 8px;
    }

    .show {
        display: flex;
    }

    a {
        color: inherit;
    }

    button {
        padding: none;
        border: none;
        background: none;
        color: inherit;
        font-size: inherit;
    }

    a,
    button {
        display: inline-block;
        cursor: pointer;
        border-radius: var(--pill-border-radius);
        background: var(--alert-bar-color);
    }

    :is(a, button):hover {
        filter: brightness(0.9);
    }
</style>
