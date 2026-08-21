---
title: "The Elements Available to a Note on This Site"
description: "A draft which sets out every typographic element the site is able to render, in order that it may be used as the starting point for a subsequent note."
pubDate: 2026-08-21
tags: ["meta"]
draft: true
---

This note carries the field `draft: true` in its frontmatter, and is therefore rendered
during local development while being excluded from the production build, the index, the
feed, and the sitemap. The following discussion sets out the elements available to a
note on this site, summarises the conventions governing each of them, and indicates the
manner in which this file should be adapted for subsequent use.

The paragraph rendered above the date is not drawn from the body of the document. It is
taken from the `description` field, and it is reproduced on the index, in the feed, and
in the page's meta description. It should accordingly be confined to one or two
sentences.

## The Treatment of Headings and Body Copy

A second-level heading opens a section. Body copy is set to a measure of thirty-three
ems, which is approximately seventy characters, a width at which sustained reading does
not require movement of the head. Inline elements behave as expected: **bold**,
*italic*, `inline code`, and [a link](https://github.com/kokko-ng), which is underlined
on hover.

### The Function of Third-Level Headings

A third-level heading is set in the monospaced face at label size, and therefore reads
as a marker rather than as a competing headline. It should be used to divide a long
section, and not to introduce a new subject.

## The Rendering of Code

Fenced blocks are highlighted at build time, with the consequence that no JavaScript is
shipped in order to display them:

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

Lines exceeding the width of the block scroll within it, rather than displacing the page.

## The Two Forms of List

An unordered list is marked with a short rule:

- Doubling the capacity costs approximately 2n copies across n appends.
- Growing by a fixed hundred slots costs n squared over two hundred.
- The worst single append remains O(n) under either strategy.

An ordered list is marked with zero-padded numerals set in the accent position:

1. Count operations rather than seconds.
2. Plot the resulting count against n.
3. Only thereafter should a profiler be consulted.

## Quotations and Tabulated Results

> Amortised analysis is an accounting device rather than a physical result. The
> expensive operation still occurs; one has merely agreed to pay for it in instalments.

| Growth strategy | Total copies for n appends | Worst single append |
| --- | --- | --- |
| Double the capacity | ~2n | O(n) |
| Grow by 1.5x | ~3n | O(n) |
| Add 100 slots | n^2 / 200 | O(n) |

A table wider than the measure scrolls within its own container, with the result that
the page itself never scrolls horizontally.

---

In sum, the elements set out above constitute the full typographic range of a note on
this site. In order to publish a note, this file should be copied to
`src/content/blog/your-slug.md`, its frontmatter replaced, and the field `draft: true`
removed once the note is ready. The filename determines the URL at which the note is
served.
