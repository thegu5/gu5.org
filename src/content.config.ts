import { defineCollection } from "astro:content";
import { rssSchema } from "@astrojs/rss";
import { z } from "astro/zod"
import { glob } from "astro/loaders";

const blog = defineCollection({
	loader: glob({ base: "./src/content/blog", pattern: '**/*.md'}),
	schema: rssSchema.extend({
		image: z.string().optional(),
		imageAlt: z.string().optional(),
	}),
});

export const collections = { blog };
