import { defineCollection } from "astro:content";
import { rssSchema } from "@astrojs/rss";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
	loader: glob({ base: "./src/content/blog", pattern: "**/*.md" }),
	schema: rssSchema.extend({
		image: z.string().optional(),
		imageAlt: z.string().optional(),
	}),
});

export const collections = { blog };
