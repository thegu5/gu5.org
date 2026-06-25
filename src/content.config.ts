import { defineCollection } from "astro:content";
import { rssSchema } from "@astrojs/rss";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { scuteSchema } from "astro-scute";

const blog = defineCollection({
	loader: glob({ base: "./src/content/blog", pattern: "**/*.md" }),
	schema: rssSchema
		.safeExtend({
			image: z.string().optional(),
			imageAlt: z.string().optional(),
		})
		.safeExtend(scuteSchema.shape),
});

export const collections = { blog };
