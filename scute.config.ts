import { defineConfig } from "astro-scute";

export default defineConfig({
	identity: "did:plc:bqqamzqieuyniwrpcosasyod",
	publications: [
		{
			collectionName: "blog",
			contentType: "markdown",
			record: {
				$type: "site.standard.publication",
				name: "Gus's blog",
				url: "https://gu5.org",
				basicTheme: {
					$type: "site.standard.theme.basic",
					accent: {
						r: 255,
						g: 255,
						b: 255,
						$type: "site.standard.theme.color#rgb",
					},
					background: {
						$type: "site.standard.theme.color#rgb",
						r: 49,
						g: 65,
						b: 88,
					},
					foreground: {
						$type: "site.standard.theme.color#rgb",
						r: 209,
						g: 213,
						b: 220,
					},
					accentForeground: {
						$type: "site.standard.theme.color#rgb",
						r: 0,
						g: 0,
						b: 0,
					},
				},
				preferences: {
					showInDiscover: true,
				},
			},
			baseContentPath: "/blog",
		},
	],
});
