import { sveltekit } from "@sveltejs/kit/vite";

/** @type {import('vite').UserConfig} */
const config = ({ mode }) => ({
    ssr: {
        noExternal: ["@fortawesome/free-solid-svg-icons", "@apollo/client", "svelte-apollo"],
    },
    optimizeDeps: {
        exclude: ["@apollo/client", "svelte-apollo"],
    },
    define: {
        __DEV__: (mode === "development").toString(),
    },
    plugins: [sveltekit()],
});

export default config;
