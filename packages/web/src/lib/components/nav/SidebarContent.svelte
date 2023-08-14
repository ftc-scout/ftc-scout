<script lang="ts">
    import {
        faBinoculars,
        faCalendarAlt,
        faClose,
        faCode,
        faGavel,
        faHashtag,
        faHome,
        faInfoCircle,
        faTrophy,
        faEnvelope,
        faCow,
        faSignal,
    } from "@fortawesome/free-solid-svg-icons";
    // import { faGithub, faDiscord } from "@fortawesome/free-brands-svg-icons";
    import SidebarItem from "./SidebarItem.svelte";
    import { sidebarOpen } from "./Sidebar.svelte";
    import Fa from "svelte-fa";
</script>

<b>
    <span>Navigate</span>
    <button on:click={() => ($sidebarOpen = false)}>
        <Fa icon={faClose} size="1.75x" style="margin-right: var(--md-gap)" />
    </button>
</b>

<SidebarItem icon={faHome} name="Home" link="/" strict />
<SidebarItem icon={faCalendarAlt} name="Events" link="/events" />
<SidebarItem icon={faHashtag} name="Teams" link="/teams" />
<SidebarItem icon={faTrophy} name="Season Records" link="/records" />

<hr />

<SidebarItem icon={faBinoculars} name="The Scouting Report" link="/blog" />

<hr />

<SidebarItem icon={faInfoCircle} name="About" link="/about" />
<SidebarItem icon={faGavel} name="Privacy" link="/privacy" />
<SidebarItem
    icon={faSignal}
    name="Status"
    link="https://uptime.9021007.xyz/status/ftcscout"
    newTab
/>
<SidebarItem icon={faCode} name="API" link="/api" />

<hr />

<SidebarItem icon={faCow} name="Discord" link="/api" />
<SidebarItem icon={faCow} name="GitHub" link="/api" />
<SidebarItem icon={faEnvelope} name="Email" link="/api" />

<style>
    hr {
        margin-bottom: var(--lg-gap);
    }

    b {
        display: none;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--lg-gap);

        font-size: var(--vl-font-size);
        font-weight: 600;
    }

    @media (max-width: 1500px) {
        b {
            display: flex;
        }
    }

    button {
        background: none;
        border: none;
    }
</style>
