import adapter from "@sveltejs/adapter-auto";
import preprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: preprocess(),
    kit: {
        adapter: adapter(),
        vite: {
            ssr: {
                noExternal: ["@fortawesome/free-solid-svg-icons", "@apollo/client", "svelte-apollo"],
            },
            optimizeDeps: {
                exclude: ["@apollo/client", "svelte-apollo"],
            },
        },
    },
};

export default config;
