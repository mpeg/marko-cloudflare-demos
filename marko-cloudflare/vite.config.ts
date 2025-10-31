import { cloudflare } from "@cloudflare/vite-plugin";
import marko from "@marko/vite";
import { defineConfig } from "vite";
import { readFile, writeFile } from "node:fs/promises";

export default defineConfig({
    environments: {
        ssr: {
            build: {
                ssr: true,
                target: "webworker",
                outDir: 'dist',
                rollupOptions: {
                    output: {
                        entryFileNames: '[name].js'
                    }
                }
            },
            resolve: {
                dedupe: ['marko'],
                conditions: ['worker']
            },

        },
        client: {
            build: {
                emptyOutDir: false,
                outDir: 'dist/public'
            }
        }
    },
    publicDir: 'public',
    plugins: [
        cloudflare({ viteEnvironment: { name: 'ssr' } }).map(p => {
            return {
                ...p, apply(config) {
                    if (config.mode === "development") {
                        return true;
                    }
                    return Boolean(config?.build?.ssr)
                }
            }
        }),
        marko({ linked: true }),
        {
            // this is needed as the cloudflare vite plugin is not expecting the linked build, and its buildApp hook hijacks the entry point on the ssr build if it finds a publicDir
            // so it's a hack where we disable it on the ssr build, knowing it will still copy the public files in the client build
            name: 'disable-public-dir-on-ssr-build',
            enforce: 'pre',
            config(config) {
                if (config.build?.ssr) {
                    return { ...config, publicDir: false }
                }
                return config;
            },
            async buildApp() {
                const wrangler = JSON.parse(await readFile('dist/wrangler.json', 'utf-8'));
                wrangler.assets = { directory: 'public', binding: 'ASSETS' };
                await writeFile('dist/wrangler.json', JSON.stringify(wrangler));
                return;
            }
        }
    ]
});
