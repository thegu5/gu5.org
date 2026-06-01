import { satteri } from "@astrojs/markdown-satteri";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import expressiveCode from "satteri-expressive-code";
import icons from "unplugin-icons/vite";

// https://astro.build/config
export default defineConfig({
	site: "https://gu5.org",

	integrations: [sitemap()],

	markdown: {
		syntaxHighlight: false, // disable shiki
		processor: satteri({
			features: { directive: true },
			hastPlugins: [
				expressiveCode({
					themes: ["catppuccin-mocha", "catppuccin-latte"],
					useThemedSelectionColors: true,
				}),
			],
		}),
	},

	vite: {
		plugins: [tailwindcss(), icons({ compiler: "astro" })],

		build: {
			assetsInlineLimit: 25 * 1024,
		},
	},
});
