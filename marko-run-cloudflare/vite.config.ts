import { cloudflare } from "@cloudflare/vite-plugin";
import baseAdapter from "@marko/run/adapter";
import marko from "@marko/run/vite";
import { defineConfig } from "vite";

export default defineConfig({
    environments: {
        ssr: {
            build: {
                outDir: "dist/"
            }
        },
        client: {
            build: {
                outDir: "dist/public"
            }
        }
    },
    plugins: [
        cloudflare({ viteEnvironment: { name: "ssr" } }),
        marko({
            // why is this needed? I don't know, but it's needed
            adapter: baseAdapter(),
        }),
    ],
});
