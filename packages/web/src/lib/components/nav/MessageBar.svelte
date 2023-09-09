<script lang="ts" context="module">
    function loadMessageBarClosed(): boolean {
        let cookie = browser ? parse(document.cookie)[MESSAGE_BAR_COOKIE_NAME] : undefined;
        let parsed = undefined;
        try {
            parsed = JSON.parse(cookie ?? "");
        } catch {}
        return parsed ?? false;
    }
    console.log("message bar cookkie parsed" + loadMessageBarClosed());
    export let showmessagebar = writable(loadMessageBarClosed());
</script>

<script lang="ts">
    // import DarkModeToggle from "./DarkModeToggle.svelte";
    // import Hamburger from "./Hamburger.svelte";
    // import Logo from "./Logo.svelte";
    // import Searchbar from "./search/Searchbar.svelte";
    import { faArrowRight, faClose } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
    import { serialize, parse } from "cookie";
    import { writable } from "svelte/store";
    import {
        MESSAGE_BAR_COOKIE_AGE,
        MESSAGE_BAR_COOKIE_NAME,
        MESSAGE_BAR_LINK,
        MESSAGE_BAR_TEXT,
    } from "$lib/constants";
    import { browser } from "$app/environment";

    let messageBarClosed = loadMessageBarClosed();
    // let messageBarClosed = false; //FOR DEBUG
    console.log(messageBarClosed);

    function handleClose() {
        console.log("message bar close button pressed");
        messageBarClosed = true;
        document.cookie = serialize(MESSAGE_BAR_COOKIE_NAME, JSON.stringify(true), {
            path: "/",
            maxAge: MESSAGE_BAR_COOKIE_AGE,
            httpOnly: false,
        });
        messageBarClosed = true;
        handleRender();
    }

    function handleRender() {
        console.log("message bar render");
        if (!browser) return;
        if (!messageBarClosed) {
            console.log("message bar opening attempt");
            try {
                let messageBar = document.getElementsByClassName("messagebar-box-hidden")[0];
                messageBar.classList.remove("messagebar-box-hidden");
                messageBar.classList.add("messagebar-box");
            } catch {
                console.log("message bar not found");
            }
        } else {
            try {
                let messageBar = document.getElementsByClassName("messagebar-box")[0];
                messageBar.classList.remove("messagebar-box");
                messageBar.classList.add("messagebar-box-hidden");
            } catch {}
        }
    }

    function onTicking() {
        handleRender();
        clearTimeout(timeoutId);
    }

    const timeoutId = setTimeout(() => onTicking(), 1); // FOR HYDRATION CHECKING
</script>

<nav>
    <div class="messagebar-box-hidden messagebar-box">
        <div class="left">
            <!-- <Logo /> -->
            <h2>{MESSAGE_BAR_TEXT}</h2>
        </div>

        <div class="right">
            <!-- <h1>close</h1> -->
            <a
                href={MESSAGE_BAR_LINK}
                target="_blank"
                rel="noreferrer"
                aria-label="Open Banner Link"
            >
                <Fa icon={faArrowRight} fw size="2x" style="font-size:35px;" />
            </a>
            <button on:click={handleClose} aria-label="Close Banner">
                <Fa icon={faClose} fw size="2x" style="font-size:35px;" />
            </button>

            <!-- <h1>close</h1> -->
        </div>
    </div>
</nav>

<style>
    .left {
        display: flex;
        align-items: center;
    }

    .right {
        display: flex;
        align-items: center;
        gap: calc(var(--lg-gap) * 1.75);
    }

    h2 {
        font-size: var(--lg-font-size);
        font-weight: 500;
        color: var(--inverse-bg-color);
    }

    a {
        /* no highlighting or underline */
        text-decoration: none;
        color: var(--inverse-bg-color);
        /* force square */
        width: calc(var(--navbar-size) * 0.7);
        height: calc(var(--navbar-size) * 0.7);
        /* center icon */
        display: flex;
        align-items: center;
        justify-content: center;
    }

    a:hover {
        background-color: rgba(0, 0, 0, 0.15);
        border-radius: 100px;
    }

    .messagebar-box-hidden {
        display: none;
    }

    .messagebar-box {
        position: fixed;
        top: var(--navbar-size);
        left: 0;
        right: 0;
        min-height: var(--navbar-size);

        padding: var(--md-pad);
        padding-left: calc(var(--xl-gap) + var(--lg-pad));

        background: var(--alert-color);
        z-index: var(--navbar-zi);

        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    button {
        background: none;
        border: none;
        color: var(--inverse-bg-color);
        text-decoration: none;
        /* force square */
        width: calc(var(--navbar-size) * 0.7);
        height: calc(var(--navbar-size) * 0.7);
        /* center icon */
        display: flex;
        align-items: center;
        justify-content: center;
    }

    button:hover {
        background-color: rgba(0, 0, 0, 0.15);
        border-radius: 100px;
    }
</style>
