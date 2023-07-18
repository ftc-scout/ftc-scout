import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
    ssr: {
        noExternal: ["@graphql-typed-document-node/core"],
    },
    optimizeDeps: {
        exclude: ["@graphql-typed-document-node/core"],
    },
    plugins: [sveltekit()],
    // Resolves importing common.
    resolve: {
        preserveSymlinks: true,
    },
});
