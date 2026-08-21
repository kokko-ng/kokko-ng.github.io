import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"blog">;

/** Drafts are visible while developing and hidden in the production build. */
export const showDrafts = import.meta.env.DEV;

/** All posts that should be listed, newest first. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection("blog", ({ data }) => showDrafts || !data.draft);
  return posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export const formatDate = (d: Date) => dateFormat.format(d);
/** Machine-readable, for <time datetime> and the monospace metadata layer. */
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);
