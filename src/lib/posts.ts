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

/** A run of related notes, or the bucket holding everything that stands alone. */
export type PostGroup =
  | { kind: "series"; name: string; posts: Post[]; latest: Date }
  | { kind: "standalone"; name: string; posts: Post[]; latest: Date };

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * The title with its series prefix removed, because the index already shows the
 * series name as a heading and the part number in its own column. Falls back to
 * the full title whenever the prefix is not present, so a post that does not
 * follow the naming convention still reads correctly.
 */
export function partTitle(post: Post): string {
  const s = post.data.series;
  if (!s) return post.data.title;
  const prefix = new RegExp(
    `^${escapeRe(s.name)}\\s*(?:pt\\.?|part)\\s*${s.part}\\s*[:\u2014\u2013-]\\s*`,
    "i",
  );
  return post.data.title.replace(prefix, "").trim() || post.data.title;
}

/**
 * Groups posts for the index: one group per series, plus one group for the
 * standalone notes. Groups are ordered by their most recent post so the newest
 * work is always at the top whether it is a series or a one-off; parts run in
 * reading order inside a series, and standalone notes run newest first.
 */
export function groupPosts(posts: Post[]): PostGroup[] {
  const series = new Map<string, Post[]>();
  const standalone: Post[] = [];

  for (const post of posts) {
    const name = post.data.series?.name;
    if (name) series.set(name, [...(series.get(name) ?? []), post]);
    else standalone.push(post);
  }

  const latestOf = (list: Post[]) =>
    new Date(Math.max(...list.map((p) => p.data.pubDate.getTime())));

  const groups: PostGroup[] = [...series.entries()].map(([name, list]) => ({
    kind: "series" as const,
    name,
    posts: [...list].sort((a, b) => (a.data.series!.part ?? 0) - (b.data.series!.part ?? 0)),
    latest: latestOf(list),
  }));

  if (standalone.length > 0) {
    groups.push({
      kind: "standalone",
      name: "Standalone notes",
      posts: [...standalone].sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()),
      latest: latestOf(standalone),
    });
  }

  // Newest group first. Ties are broken deterministically so the order does not
  // shift between builds when several posts share a date.
  return groups.sort((a, b) => {
    const byDate = b.latest.getTime() - a.latest.getTime();
    if (byDate !== 0) return byDate;
    if (a.kind !== b.kind) return a.kind === "series" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}
