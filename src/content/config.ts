import { defineCollection, z } from "astro:content";
import { rssSchema } from "@astrojs/rss";

const blog = defineCollection({
	schema: rssSchema.extend({
		image: z.string().optional(),
		imageAlt: z.string().optional(),
	}),
});

export const collections = { blog };
