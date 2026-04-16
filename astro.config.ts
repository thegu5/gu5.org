import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import expressiveCode from "astro-expressive-code";
import icons from "unplugin-icons/vite";

// https://astro.build/config
export default defineConfig({
	site: "https://gu5.org",

	prefetch: {
		prefetchAll: true,
	},

	integrations: [
		sitemap(),
		expressiveCode({
			themes: ["catppuccin-mocha", "catppuccin-latte"],
			useThemedSelectionColors: true,
		}),
	],
	vite: {
		plugins: [tailwindcss(), icons({ compiler: "astro" })],

		build: {
			assetsInlineLimit: 25 * 1024,
		},
	},
});
