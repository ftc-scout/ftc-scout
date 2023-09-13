<script lang="ts" context="module">
    function loadAlertPreference(): {
        preference: "show" | "hide";
    } {
        let cookie = browser ? parse(document.cookie)[ALERT_COOKIE_NAME] : undefined;
        let parsed = undefined;
        try {
            parsed = JSON.parse(cookie ?? "");
        } catch {}
        return (
            parsed ?? {
                preference: parsed,
            }
        );
    }

    export let theme = writable(loadAlertPreference());
</script>

<script lang="ts">
    import { serialize, parse } from "cookie";
    import { writable } from "svelte/store";
    import Fa from "svelte-fa";
    import { faClose, faArrowRight } from "@fortawesome/free-solid-svg-icons";
    import {
        ALERT_COOKIE_AGE,
        ALERT_COOKIE_NAME,
        ALERT_LINK,
        ALERT_LINK_ENABLED,
        ALERT_MESSAGE,
    } from "../../constants";
    import { browser } from "$app/environment";

    function handleBarChange(newTheme: typeof $theme) {
        console.log("writing cookie" + newTheme.preference);

        document.cookie = serialize(ALERT_COOKIE_NAME, JSON.stringify(newTheme), {
            path: "/",
            maxAge: ALERT_COOKIE_AGE,
            httpOnly: false,
        });

        render();
    }

    function setBar(next: "show" | "hide") {
        console.log("setBar" + next);
        $theme = {
            preference: next,
        };
        handleBarChange($theme);
    }

    function render() {
        console.log("render" + $theme.preference);
        if ($theme.preference == undefined) {
            $theme = {
                preference: "show",
            };
            console.log("set to show");
        }
        console.log("render" + $theme.preference);
        if ($theme.preference == "show") {
            // remove class from element
            document.getElementsByClassName("alert")[0].classList.remove("alerthide");
        } else {
            // add class to element
            document.getElementsByClassName("alert")[0].classList.add("alerthide");
        }
        return null;
    }
</script>

<nav on:load={render()}>
    <div class="alerthide alert">
        <div class="left">
            <p>{ALERT_MESSAGE}</p>
        </div>

        <div class="right">
            {#if ALERT_LINK_ENABLED}
                <a href={ALERT_LINK} target="_blank" rel="noopener noreferrer">
                    <button
                        ><Fa
                            icon={faArrowRight}
                            fw
                            size="1.25x"
                            translateX="0"
                            style="font-size: 35px"
                        /></button
                    >
                </a>
            {/if}
            <!-- close button -->
            <button on:click|preventDefault={() => setBar("hide")}
                ><Fa
                    icon={faClose}
                    fw
                    size="1.25x"
                    translateX="0"
                    style="font-size: 40px"
                /></button
            >
        </div>
    </div>
    <button on:click|preventDefault={() => render()}>Render</button>
</nav>

<style>
    button {
        padding: 0;
        border: none;
        background: none;
        color: var(--alertbar-text-color);
        width: calc(var(--navbar-size) * 0.8);
        height: calc(var(--navbar-size) * 0.8);
        cursor: pointer;
    }

    button:hover {
        background-color: rgba(0, 0, 0, 0.15);
        border-radius: 10000px;
    }

    .alerthide {
        display: none !important;
    }

    .alert {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;

        margin-top: var(--navbar-size);
        min-height: var(--navbar-size);

        padding: var(--md-pad);
        padding-left: calc(var(--navbar-size) * 0.8);

        background: var(--alertbar-color);
        z-index: var(--navbar-zi);

        display: flex;
        align-items: center;
        justify-content: space-between;

        font-size: var(--md-font-size);
    }

    .left {
        display: flex;
        align-items: center;
    }

    .right {
        display: flex;
        align-items: center;
        gap: calc(var(--lg-gap) * 1.75);
    }
</style>
