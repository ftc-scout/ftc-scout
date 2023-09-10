<script lang="ts">
    import Card from "$lib/components/Card.svelte";

    export let slug: string;
</script>

<Card>
    <article>
        <div class="head">
            <h1 id={slug}><a href="#{slug}"><slot name="title" /></a></h1>
            <div class="info">By <slot name="author" /> on <slot name="date" /></div>
        </div>

        <div class="rest">
            <slot />

            <p class="suggestions">
                If you have any suggestions for topics you would like us to cover email us at
                <a href="mailto:suggestions@ftcscout.org"> suggestions@ftcscout.org</a>.
            </p>
        </div>
    </article>
</Card>

<style>
    .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--md-gap);

        background: var(--hover-color);
        border-radius: 8px;
        padding: var(--md-pad);

        margin-bottom: var(--sm-gap);
    }

    @media (max-width: 800px) {
        .head {
            flex-direction: column;
        }
    }

    a {
        color: inherit;
    }

    .info {
        font-style: italic;
        color: var(--secondary-text-color);
    }

    .rest {
        padding: var(--sm-pad);
    }

    .suggestions {
        font-style: italic;
        color: var(--secondary-text-color);
    }

    h1 {
        font-size: var(--vl-font-size);
    }

    article :global(p) {
        line-height: 1.75;
    }

    article :global(ol) {
        line-height: 1.75;
        margin-left: var(--vl-gap);
    }

    article :global(:is(p, ol):not(:last-child)) {
        margin-bottom: var(--lg-gap);
    }

    article :global(:is(p, ol):not(:first-child)) {
        margin-top: var(--lg-gap);
    }
</style>
