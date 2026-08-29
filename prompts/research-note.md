# Prompt — a research note, standalone or as a series

Paste this into Claude Code from the root of this repo, replacing the bracketed
fields. It reproduces the process behind every note currently in
`src/content/blog/`.

The process has one hard gate: **no note is written from what the model already
knows.** Every claim in a published note traces to a source that was fetched and
checked during the run. The `/deep-research` step below is not optional and not
substitutable by recall, by a single web search, or by the model's confidence
that it knows the literature.

---

## The prompt

> Write [a standalone research note | a N-part research series] on **[subject]**,
> for the blog in this repo.
>
> The angle is the practical implications of the literature for **[audience
> concern — e.g. prompting long-horizon agentic coding assistants]**. Use only
> academic sources: peer-reviewed venues, conference proceedings, and recognised
> preprints from those communities. No blog posts, vendor material, consultancy
> writing, or books without empirical backing. Where a widely repeated claim is
> folklore rather than evidence, say so and label it.
>
> Follow `prompts/research-note.md` in this repo end to end, including the
> `/deep-research` gate, the reference-verification gate, and the verification
> pass before committing. Write in the `write-like-kokko` style.

---

## Step 1 — Run `/deep-research`. Not optional.

Invoke the skill before writing anything:

```
/deep-research <the question, built to the template below>
```

The question must ask, for every finding, all four of:

- **(a)** the precise falsifiable claim, with the numbers;
- **(b)** the primary source — full author list, venue, year;
- **(c)** the strength of the evidence, including replications, contradicting
  studies, and published critiques;
- **(d)** the concrete implication for [audience concern], **labelled as an
  extrapolation** where the source did not study that setting.

Enumerate 8–12 sub-areas to search rather than asking one broad question. A
broad question returns a summary; an enumerated question returns claims with
numbers attached.

Close the question with these constraints verbatim:

> Distinguish sharply between (i) findings established in the literature and
> (ii) any implication for [audience concern], which is almost always an
> extrapolation and must be labelled as such. Verify every author list, title,
> venue and year exactly; never invent bibliographic metadata.

**If the workflow's search budget is exhausted** (the run reports
`web search budget`), its agents fall back to fetching from memory and its
adversarial verification phase becomes worthless — it can no longer check
anything against a source. The claims it extracts from fetched primary sources
are still usable. The verdicts are not. Say so in the write-up, and treat Step 2
as the only verification that happened.

### What comes back is a candidate list, not a draft

Read every claim. Discard the ones that are assertions from a paper's abstract
rather than results. Keep the limitations the workflow surfaced — the sample
sizes, the single-system caveats, the authors' own hedges. Those are what make
the note honest, and they belong in the prose, not in a footnote.

---

## Step 2 — Verify every reference yourself. Not optional.

The single worst failure this process has produced was inventing author lists
and titles for two bare arXiv IDs. Assume it will happen again unless every
reference is checked against a bibliographic database.

Query one at a time — both APIs rate-limit, and four parallel calls get a 503:

```
WebFetch https://dblp.org/search/publ/api?q=<distinctive+title+words>&format=json&h=4
WebFetch https://api.openalex.org/works?search=<title>&per-page=2&select=display_name,publication_year,authorships,primary_location,biblio,doi
```

Prompt each fetch with: *"List every hit verbatim: full author list in order,
exact title, venue, volume, number, pages, year."*

Rules:

- Record confirmed entries to a scratch file as you go. Cite only from that file.
- Watch for the **online-first year**: OpenAlex often reports the preprint year,
  not the issue year. Use the issue year when the volume is known.
- Watch for **name collisions** — two different people with the same surname and
  initial have already caused one correction in this repo.
- OpenAlex garbles some author lists (`"Wei Jason"`, `"Ed H."`). Cross-check
  against DBLP or the publisher page before using one.
- **If a reference cannot be verified, cut the claim.** Do not soften it, do not
  cite it loosely, do not keep it with a hedge. One claim was removed from
  `decomposition-propagation-cost-and-task-scoping.md` for exactly this reason.

Before committing, cross-check the rendered reference list against the scratch
file mechanically, not by reading.

---

## Step 3 — Decide the shape

**Standalone** when the argument closes in one piece. No `series` frontmatter;
it lands in *Standalone notes* on the index.

**Series** when there are three or four distinct moves, each with its own
evidence base. Title each part `<Series name> pt. N: <Part title>`, and add:

```yaml
series:
  name: "Agentic Coding x Software Architecture"
  part: 2
```

The index groups by `name`, orders by `part`, and strips the
`<Series name> pt. N: ` prefix from the row, so the part title has to read on
its own. Adding a new series needs no code change.

Each part ends with a one-sentence link to the next:

```markdown
[The second note in this series](/blog/<slug>/) takes up <what it covers>.
```

---

## Step 4 — Write in the `write-like-kokko` style

Skill: <https://github.com/kokko-ng/write-like-kokko>. Load it; do not
approximate it from this summary.

Structure, per piece:

- **Roadmap opening.** Position stated flatly, then every move enumerated
  (`It will be shown that` / `Next, it will be argued that` / `It will then be
  argued that` / `Lastly, …`), then a scoping note (`It should be noted at the
  outset that …`) declaring what was not studied.
- **One claim per paragraph**, in the first sentence, closed by a summative
  restatement (`In sum,` `Therefore,` `Accordingly,` `Consequently,`).
- **Author-as-subject citation** preferred over parenthetical, about 3:1.
- **Make the warrant explicit** — say *because*.
- **Voice the strongest objection with a name on it**, then answer it. A section
  that concedes nothing has not been checked.
- **Hedging ladder.** Never move a claim up a rung to make a paragraph land.
- **Mirror conclusion** in past tense, then `A common thread running through …`,
  then `As a next step, …`.
- Headings are **noun phrases naming content**. Never imperatives, never
  questions, no colon-cleverness. This rule has been broken once and caught in
  review; check it explicitly.
- British spelling. No second person, no rhetorical questions, no contractions,
  no sentence-initial And/But/So, no bold in body prose, no em-dash-as-drama, no
  "complex/nuanced/multifaceted" without specifying.

Two devices worth reusing:

- A `<div class="tenet">` block stating **what the evidence supports** and **what
  it does not**, immediately after a section that could be over-read.
- A `## What this review could not establish` section near the end, stating that
  absence of a verified claim means *not established in this review*, not
  *refuted*.

Every practical recommendation sits under a sentence marking the whole section as
extrapolation.

---

## Step 5 — Diagrams

Distill-style: figures break out to the full column while the prose stays at the
reading measure. Inline SVG in the Markdown, theme-aware through classes only.

**Never hard-code a colour.** The whole vocabulary is in `src/styles/global.css`:

| Shapes | Lines | Text |
| --- | --- | --- |
| `.box` outline · `.fill` tint · `.hot` ink-filled | `.line` · `.rule` · `.dash` · `.arrow` · `.plot` · `.band` | `.t` ink · `.tm` mid · `.tf` small caps · `.tr` reversed on `.hot` |

Emphasis is carried by an ink-filled shape with reversed text, never by colour.

**A blank line inside `<svg>` terminates the raw-HTML block and the rest of the
figure renders as flowing prose.** This has broken the site once. No blank lines
between SVG elements, ever. It is checked in Step 7.

Markup:

```html
<figure>
<svg class="dg" viewBox="0 0 620 240" role="img" aria-labelledby="ttl-x">
<title id="ttl-x">What the diagram shows</title>
<rect class="fill" x="20" y="30" width="120" height="30"/>
<text class="t" x="80" y="50" text-anchor="middle">label</text>
</svg>
<figcaption><span class="label">Figure N</span> What the figure shows, what it
does NOT claim, and provenance. Drawn from Author (year).</figcaption>
</figure>
```

Caption rules, all three required:

1. The prose points at the figure by number before or just after it appears.
2. The caption states what the figure does **not** claim — schematic curves must
   say they carry no published values.
3. Provenance is given: `Drawn from …` / `Adapted from …`.

Draw only what the verified claims support. Four diagrams were cut from the
first series because their subjects returned no verified claim.

---

## Step 6 — Frontmatter

```yaml
---
title: "Agentic Coding x Software Architecture pt. 2: Assembling the Context"
description: "One or two sentences. Shown on the index, in the feed, and as the meta description."
pubDate: 2026-08-29
tags: ["software architecture", "prompting", "agents"]
series:                    # omit entirely for a standalone note
  name: "Agentic Coding x Software Architecture"
  part: 2
draft: true                # remove to publish
---
```

References go last, as `<ol class="refs">` with one `<li>` per source,
alphabetical by surname.

---

## Step 7 — Verify before committing

Run all six. The first four are cheap; skipping them has cost a re-deploy.

**1. Blank lines inside SVG, and reference cross-check**

```bash
python3 - <<'EOF'
import re, glob
for f in glob.glob("src/content/blog/*.md"):
    s = open(f).read()
    bad = sum(1 for m in re.finditer(r'<svg\b.*?</svg>', s, re.S)
              if re.search(r'\n\s*\n', m.group(0)))
    if bad: print("BLANK LINE IN SVG:", f, bad)
print("svg check done")
EOF
```

**2. Style metrics** — write to the scratchpad and run against each new post:

```python
import re, sys, statistics
BAN = [r'\byou\b', r'\byour\b', r"\bdon't\b", r"\bit's\b", r'\bcomplex\b',
       r'\bnuanced\b', r'\bmultifaceted\b', r'\*\*', r'\bbehavior\b',
       r'\borganize', r'\banalyze', r'\bcolor\b']
def prose(p):
    s = open(p).read()
    for pat in [r'^---.*?\n---\n', r'<figure[^>]*>.*?</figure>', r'<aside[^>]*>.*?</aside>',
                r'<div class="tenet">.*?</div>', r'<ol class="refs">.*?</ol>', r'`{3}.*?`{3}']:
        s = re.sub(pat, '', s, flags=re.S)
    for pat in [r'^\|.*$', r'^#{1,6} .*$', r'^\d+\. .*$']:
        s = re.sub(pat, '', s, flags=re.M)
    return re.sub(r'\[(.*?)\]\(.*?\)', r'\1', s)
for p in sys.argv[1:]:
    s = prose(p)
    sents = [x.strip() for x in re.split(r'(?<=[.!?])\s+(?=[A-Z"“])', s.replace('\n', ' ')) if len(x.strip()) > 3]
    lens = [len(x.split()) for x in sents]; words = sum(lens)
    cites = len(re.findall(r"\(\d{4}[a-z]?\)|\(\w[\w\s.&,'éø-]*?,?\s*\d{4}\)", s))
    narr = len(re.findall(r"[A-ZÉ][\wéøå]+(?:\s+(?:et al\.|and\s+[A-Z]\w+|&\s*[A-Z]\w+|,\s*[A-Z]\w+))*\s*\(\d{4}\)", s))
    print(f"{p.split('/')[-1]}\n  words {words} mean {statistics.mean(lens):.1f} median {statistics.median(lens)}")
    print(f"  >30w {100*sum(l>30 for l in lens)/len(lens):.0f}%  <15w {100*sum(l<15 for l in lens)/len(lens):.0f}%")
    print(f"  citations 1 per {words/max(cites,1):.0f} words; narrative {narr}, parenthetical {cites-narr}")
    flat = re.sub(r'\s+', ' ', s)
    for b in BAN:
        m = re.findall(b, flat, flags=re.I)
        if m: print(f"  BANNED {b}: {len(m)} {m[:4]}")
    # Case-sensitive, and anchored to a real sentence start: line wrapping makes
    # a bare ^ fire on every wrapped line beginning with "and".
    init = re.findall(r'(?:(?<=[.!?] )|^)(And|But|So)\b', flat)
    if init: print(f"  BANNED sentence-initial: {len(init)} {init[:4]}")
```

Targets, from the measured corpus:

| Property | Target |
| --- | --- |
| Mean sentence length | 30–34 words |
| Median | ~31 |
| Sentences over 30 words | about half |
| Sentences under 15 words | roughly one in ten |
| Citation density | one per 60–80 words |
| Narrative : parenthetical citations | about 3:1 |
| Banned constructions | zero |

Also confirm by multiline search — line wrapping defeats a plain `grep` — that
each piece has a roadmap, `A common thread running`, and `As a next step`.

**3. Build**

```bash
npx astro check && npx astro build
```

**4. Rendered SVG and links**

```bash
grep -c '<svg' dist/blog/<slug>/index.html          # matches the source count
grep -oh 'href="/blog/[^"]*"' dist/blog/*/index.html | sort -u   # every target exists
```

**5. Text overflowing a diagram** — serve `dist/` and, in the browser, measure
every `<text>` against its `viewBox`. Two labels overflowed their figures on the
first pass and neither was visible in a full-page screenshot:

```js
document.querySelectorAll('.prose figure svg').forEach((svg, i) => {
  const vb = svg.viewBox.baseVal;
  svg.querySelectorAll('text').forEach(t => {
    const b = t.getBBox();
    if (b.x + b.width > vb.width - 2) console.log(`fig${i+1} X-overflow: ${t.textContent}`);
    if (b.y + b.height > vb.height + 1) console.log(`fig${i+1} Y-overflow: ${t.textContent}`);
  });
});
```

**6. Layout regression** — load every page in an iframe at 1440 / 1280 / 1199 /
900 / 560 / 390 px and assert: no vertical gap over 60px between consecutive
`.prose` children, no margin note overlapping body content, no horizontal
overflow. Check both themes with `document.documentElement.dataset.theme`.

A tall margin note used to push the next heading below it and open a column of
white space. The cause was `--prose` in `em`, which resolves against each
element's own font-size and gave headings a 627px column against the body's
528px. Measures are in `rem` now. Keep them there.

---

## Step 8 — Commit and deploy

Commits in this repo are authored `kokko-ng <Kokko.Ng@insight.com>`.

```bash
git -c user.name=kokko-ng -c user.email=Kokko.Ng@insight.com commit -m "…"
git push origin main
```

Then wait for the run **for this commit**, matching on SHA — a loop that reads
the newest run will report success from the previous deploy:

```bash
SHA=$(git rev-parse HEAD)
gh run list --workflow=deploy.yml --limit 5 \
  --json headSha,status,conclusion,displayTitle \
  --jq ".[] | select(.headSha==\"$SHA\")"
```

Confirm live with a cache-busted request, checking the title and the SVG count
per post:

```bash
curl -s "https://kokko-ng.github.io/blog/<slug>/?cb=$RANDOM" | grep -c '<svg'
```

---

## Failure modes already hit

Each of these cost a correction. They are the reason for the gates above.

| What went wrong | The gate that catches it |
| --- | --- |
| Invented author lists for two bare arXiv IDs | Step 2, every reference fetched |
| Blank line inside `<svg>` — figure rendered as prose | Step 7.1 |
| Imperative headings, against the style skill | Step 4, checked explicitly |
| Citation density too low (1 per 107 vs 60–80) | Step 7.2 |
| Two SVG labels running past the viewBox | Step 7.5 |
| Deploy verified against the *previous* run | Step 8, match on SHA |
| Claim kept whose source could not be found | Step 2, cut it |
| Sentence-length mean inflated by headings glued to prose | Step 7.2 strips headings first |
