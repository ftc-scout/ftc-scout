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
        faSignal,
        faChartPie,
    } from "@fortawesome/free-solid-svg-icons";
    import { faGithub, faDiscord } from "@fortawesome/free-brands-svg-icons";
    import SidebarItem from "./SidebarItem.svelte";
    import { sidebarOpen } from "./Sidebar.svelte";
    import Fa from "svelte-fa";
    import IconSidebarItem from "./IconSidebarItem.svelte";
    import { EMAIL } from "../../constants";
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
<SidebarItem icon={faChartPie} name="Statistics" link="/stats" />

<hr />

<SidebarItem icon={faBinoculars} name="The Scouting Report" link="/blog" />

<hr />

<SidebarItem icon={faInfoCircle} name="About" link="/about" />
<SidebarItem icon={faGavel} name="Privacy Policy" link="/privacy" />
<SidebarItem icon={faCode} name="API" link="/api" />

<hr />

<div class="icons">
    <IconSidebarItem
        icon={faGithub}
        name="Github"
        link="https://github.com/16321-X-Drive/ftc-scout"
    />
    <IconSidebarItem icon={faDiscord} name="Discord" link="https://discord.gg/XTZhD9RnKa" />
    <IconSidebarItem icon={faEnvelope} name="Email" link="mailto:{EMAIL}" />
    <IconSidebarItem
        icon={faSignal}
        name="Status"
        link="https://uptime.9021007.xyz/status/ftcscout"
        newTab
    />
</div>

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

    .icons {
        display: flex;
        align-items: center;
        justify-content: space-around;
    }
</style>
