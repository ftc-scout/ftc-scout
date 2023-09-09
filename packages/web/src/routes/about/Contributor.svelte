<script lang="ts">
    export let name: string;
    export let role: string;
    export let imgSrc: string;
    export let alt: string;
    export let href: string;
</script>

<a class="wrap" {href} target="_blank" rel="noreferrer">
    <img src={imgSrc} {alt} />
    <div class="info">
        <span>{name}</span>
        <span class="role">{role}</span>
    </div>
</a>

<style>
    .wrap {
        flex-grow: 1;
        min-width: 250px;
        max-width: 300px;
        display: flex;
        align-items: center;
        gap: var(--md-gap);

        padding: 0 var(--md-pad);
        border-radius: 8px;

        cursor: pointer;
        color: inherit;
    }

    .wrap:hover {
        background: var(--hover-color);
        text-decoration: none;
    }

    .info {
        display: flex;
        flex-direction: column;
    }

    .role {
        color: var(--secondary-text-color);
        font-style: italic;
    }

    img {
        width: 64px;
        height: 64px;
        border-radius: var(--pill-border-radius);
        margin: 0.5rem;
    }

    @media (max-width: 800px) {
        img {
            width: 48px;
            height: 48px;
        }
    }
</style>
