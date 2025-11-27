import { cloudflare } from "@cloudflare/vite-plugin";
import marko from "@marko/vite";
import { defineConfig } from "vite";

export default defineConfig({
    environments: {
        ssr: {
            resolve: {
                dedupe: ['marko'],
                conditions: ['worker']
            },
            optimizeDeps: {
                exclude: ['marko']
            }
        },
        client: {
            build: {
                modulePreload: {
                    polyfill: false
                }
            }
        }
    },
    builder: {
		async buildApp(builder) {
			const { ssr, client } = builder.environments;
			if (!ssr || !client) {
				throw new Error("Both ssr and client environments must be defined");
			}
			await builder.build(ssr);
			await builder.build(client);
		},
	},
    publicDir: 'public',
    plugins: [
        cloudflare({ viteEnvironment: { name: 'ssr' } }),
        marko({ linked: true }),
    ]
});
