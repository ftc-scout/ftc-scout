import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [sveltekit()],
    // Resolves importing common.
    resolve: {
        preserveSymlinks: true,
    },
});
