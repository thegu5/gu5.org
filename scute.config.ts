import { defineConfig } from "astro-scute";

export default defineConfig({
	identity: "did:plc:bqqamzqieuyniwrpcosasyod",
	publications: [
		{
			collectionName: "blog",
			tid: "3mpzkkds4xceb",
			contentType: "markdown",
			record: {
				$type: "site.standard.publication",
				name: "Gus's blog",
				url: "https://gu5.org",
				basicTheme: {
					$type: "site.standard.theme.basic",
					accent: {
						r: 0,
						g: 120,
						b: 111,
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
						r: 255,
						g: 255,
						b: 255,
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
