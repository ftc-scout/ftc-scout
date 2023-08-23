<script lang="ts">
    import { RemoteOption } from "@ftc-scout/common";
    import Select from "./Select.svelte";

    export let remote: RemoteOption;
    export let nonForm = false;
    export let id: string | null = null;
</script>

<Select
    bind:value={remote}
    name={"remote"}
    options={[
        { value: RemoteOption.All, name: "All" },
        { value: RemoteOption.Trad, name: "Traditional Only" },
        { value: RemoteOption.Remote, name: "Remote Only" },
    ]}
    {nonForm}
    {id}
    on:change
/>
