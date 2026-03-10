import rss, { type RSSFeedItem } from '@astrojs/rss';
import type { APIContext } from 'astro';
// ehhh
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getCollection, render } from 'astro:content';
import { transform, walk } from 'ultrahtml';
import sanitize from 'ultrahtml/transformers/sanitize';

// https://github.com/delucis/astro-blog-full-text-rss/blob/latest/src/pages/rss.xml.ts
export async function GET(context: APIContext) {
    let baseUrl = context.site!.href;
    if (baseUrl.at(-1) === "/") baseUrl = baseUrl.slice(0, -1);

    const posts = (await getCollection("blog")).sort((a, b) => a.data.pubDate! > b.data.pubDate! ? -1 : 1);

    const container = await AstroContainer.create();

    const feedItems: RSSFeedItem[] = [];
    for (const post of posts) {
        const { Content } = await render(post);
        const rawContent = await container.renderToString(Content);
        
        const content = await transform(rawContent.replace(/^<!DOCTYPE html>/, ""), [
            async (node) => {
                await walk(node, (node) => {
                    if (node.name === "a" && node.attributes.href?.startsWith("/")) {
                        node.attributes.href = baseUrl + node.attributes.href;
                    }
                    if (node.name === "img" && node.attributes.src?.startsWith("/")) {
                        node.attributes.src = baseUrl + node.attributes.src;
                    }
                });
                return node;
            },
            sanitize({ dropElements: ["script", "style"] }),
        ]);

        feedItems.push({ ...post.data, link: `/blog/${post.id}`, content });
    }

    return rss({
        title: "Gus's Blog",
        description: "stuff i write!",
        site: baseUrl,
        items: feedItems
    });
}
