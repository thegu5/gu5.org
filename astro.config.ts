import { satteri } from "@astrojs/markdown-satteri";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import expressiveCode from "astro-expressive-code";
import scute from "astro-scute";
import icons from "unplugin-icons/vite";

// https://astro.build/config
export default defineConfig({
	site: "https://gu5.org",

	integrations: [
		sitemap(),
		expressiveCode({
			themes: ["catppuccin-mocha", "catppuccin-latte"],
			useThemedSelectionColors: true,
		}),
		scute(),
	],

	markdown: {
		syntaxHighlight: false, // disable shiki
		processor: satteri({
			features: { directive: true },
		}),
	},

	vite: {
		plugins: [tailwindcss(), icons({ compiler: "astro" })],

		build: {
			assetsInlineLimit: 25 * 1024,
		},
	},
});
