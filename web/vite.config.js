import { sveltekit } from "@sveltejs/kit/vite";

/** @type {import('vite').UserConfig} */
const config = {
    ssr: {
        noExternal: ["@fortawesome/free-solid-svg-icons", "@apollo/client", "svelte-apollo"],
    },
    optimizeDeps: {
        exclude: ["@apollo/client", "svelte-apollo"],
    },
    plugins: [sveltekit()],
};

export default config;
