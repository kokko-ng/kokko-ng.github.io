---
title: "Every element a note on this site can render"
description: "A draft that exercises the whole type system — headings, code, lists, quotes and tables — so it can be copied as the starting point for a real note."
pubDate: 2026-08-21
tags: ["meta"]
draft: true
---

This note carries `draft: true` in its frontmatter, so it renders during local
development and is left out of the production build, the index, the feed and the
sitemap. What follows sets out every element a note can use, the convention governing
each one, and how to adapt this file for a real post.

The paragraph above the date is not part of the body. It comes from the `description`
field, and the same text appears on the index, in the feed, and as the page's meta
description — so keep it to one or two sentences.

## Headings and body copy

A second-level heading opens a section. Body copy is set to a 33em measure, about
seventy characters, which is a width you can read for a long stretch without moving
your head. Inline elements behave as expected: **bold**, *italic*, `inline code`, and
[a link](https://github.com/kokko-ng), which underlines on hover.

### What third-level headings are for

A third-level heading is set in the monospace face at label size, so it reads as a
marker rather than a competing headline. Use it to divide a long section, not to
introduce a new subject.

## Code

Fenced blocks are highlighted at build time, so nothing ships to the browser to display
them:

```python
class DynamicArray:
    def append(self, value):
        if self._n == self._cap:
            self._grow(2 * self._cap)   # <- the expensive branch
        self._slots[self._n] = value
        self._n += 1

    def _grow(self, cap):
        bigger = [None] * cap
        for i in range(self._n):        # every element, copied
            bigger[i] = self._slots[i]
        self._slots, self._cap = bigger, cap
```

Lines wider than the block scroll inside it rather than pushing the page sideways.

## The two kinds of list

An unordered list is marked with a short rule:

- Doubling the capacity costs roughly 2n copies across n appends.
- Growing by a fixed hundred slots costs n squared over two hundred.
- The worst single append is O(n) under either strategy.

An ordered list is marked with zero-padded numerals in the accent position:

1. Count operations, not seconds.
2. Plot the count against n.
3. Only then reach for a profiler.

## Quotes and tables

> Amortised analysis is an accounting device, not a physical result. The expensive
> operation still happens; you have only agreed to pay for it in instalments.

| Growth strategy | Total copies for n appends | Worst single append |
| --- | --- | --- |
| Double the capacity | ~2n | O(n) |
| Grow by 1.5x | ~3n | O(n) |
| Add 100 slots | n^2 / 200 | O(n) |

A table wider than the measure scrolls inside its own container, so the page itself
never scrolls horizontally.

---

That is the full range. To write a real note, copy this file to
`src/content/blog/your-slug.md`, replace the frontmatter, and drop `draft: true` when
it is ready. The filename becomes the URL.
