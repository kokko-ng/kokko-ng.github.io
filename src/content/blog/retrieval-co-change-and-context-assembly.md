---
title: "Agentic Coding x Software Architecture pt. 2: Assembling the Context"
description: "Which files to hand a coding agent and in what order, drawn from the measured failure rates of repository retrieval and from what version history reveals that static analysis cannot."
pubDate: 2026-08-29
tags: ["software architecture", "prompting", "agents"]
series:
  name: "Agentic Coding x Software Architecture"
  part: 2
---

The following discussion maintains that the file-selection step, rather than the generation
step, is where a large and measured share of agentic coding failure currently sits, and that
the popular inference — that a longer context window dissolves the problem — is contradicted
by the same measurements that establish it. It will be shown that supplying the correct files
outright more than doubles issue-resolution rates on a standard benchmark, which places the
bottleneck in retrieval rather than in editing. Next, it will be argued that localisation
over an explicit repository structure outperforms embedding-based retrieval, and that the two
are complementary rather than redundant. It will then be argued that the cross-file context
which actually rescues a failed edit is architecturally adjacent, while restricting retrieval
to that adjacency in advance makes results worse, so adjacency is a description of the answer
and not a method for finding it. Lastly, version history will be presented as a source of
coupling that static analysis cannot see at all, together with the precision limits that
bound its use, and a context-assembly procedure will be constructed in full. It should be
noted at the outset that the agent studies cited here are benchmark evaluations on Python and
C# repositories, that the architecture studies were conducted on human maintainers, and that
every recommendation below is an extrapolation, marked as such where it appears.

## The share of failure attributable to retrieval

Supplying an agent with the files that need to change more than doubles its success rate,
which locates a large part of the failure before any code is written. Jimenez et al. (2024)
constructed a benchmark of 2,294 issue and pull-request instances drawn from twelve Python
repositories, and evaluated models under two retrieval conditions. Jimenez et al. (2024) found that under sparse retrieval
over the repository the best model of the time resolved 1.96 per cent of issues, and that
under an oracle condition handing over the files the human patch had touched the same model
resolved 4.8 per cent. The retrieval condition itself is
unreliable in a way that explains the gap. Jimenez et al. (2024) report that at a 27,000
token limit their sparse retriever returned a superset of the oracle files in roughly forty
per cent of instances, and returned none of the oracle files in almost half. Figure 1 sets
the two conditions side by side. In sum, a substantial share of measured agent failure is a
failure to find the right files, because performance more than doubles when finding them is
removed from the task.

<figure>
<svg class="dg" viewBox="0 0 620 244" role="img" aria-labelledby="ttl-oracle">
<title id="ttl-oracle">Issue resolution under retrieved and oracle file selection</title>
<text class="tf" x="20" y="20">Resolution rate, same model, same 2,294 instances</text>
<path class="rule" d="M 150 36 L 150 150"/>
<rect class="fill" x="150" y="48" width="73" height="30"/>
<rect class="hot" x="150" y="98" width="179" height="30"/>
<text class="tm" x="140" y="68" text-anchor="end">sparse retrieval</text>
<text class="tm" x="140" y="118" text-anchor="end">oracle files supplied</text>
<text class="t" x="233" y="68">1.96%</text>
<text class="t" x="339" y="118">4.8%</text>
<path class="rule" d="M 150 150 L 600 150"/>
<text class="tf" x="150" y="166">0</text>
<text class="tf" x="336" y="166">5%</text>
<text class="tf" x="20" y="196">What the retriever returned, at a 27,000 token budget</text>
<rect class="fill" x="20" y="206" width="222" height="24"/>
<rect class="box" x="242" y="206" width="90" height="24"/>
<rect class="box" x="332" y="206" width="268" height="24"/>
<text class="t" x="131" y="222" text-anchor="middle">superset of oracle, ~40%</text>
<text class="tm" x="287" y="222" text-anchor="middle">partial</text>
<text class="t" x="466" y="222" text-anchor="middle">none of the oracle files, ~half</text>
</svg>
<figcaption><span class="label">Figure 1</span> Resolution rate for the same model on the
same benchmark instances under sparse repository retrieval and under an oracle condition in
which the files touched by the human patch were supplied directly, with the retriever's own
hit profile beneath. The figure reports one model on one benchmark and does not claim that
the ratio holds for other models, other languages, or non-benchmark repositories. Drawn from
Jimenez et al. (2024).</figcaption>
</figure>

The interpretation that a longer context window removes the problem is not supported, and
the same benchmark contains the counter-evidence. Jimenez et al. (2024) report that model
performance degrades as the total supplied context grows, and that models frequently fail to
localise the code requiring change when given large volumes of loosely related code. Liu et
al. (2024) had already established the positional form of the same effect, showing that
accuracy falls when the relevant material sits in the middle of a long input rather than at
either end. The
edit behaviour shows the same pattern from the other side, because model patches averaged
30.1 changed lines against 74.5 for the human patches and rarely touched more than a single
file (Jimenez et al., 2024). Therefore the retrieval problem is not a capacity problem but a
selection problem, because adding material that was not selected makes the measured outcome
worse rather than better.

## The advantage of localising over an explicit structure

Localisation carried out over an explicit view of the repository outperforms embedding-based
retrieval, and the two turn out to be complementary. Xia et al. (2025) built a fixed
three-phase pipeline of localisation, repair and patch validation, in which the model is
never permitted to choose its own actions, and report that it outperformed all then-existing
open-source autonomous agents on the same benchmark. The localisation phase proceeds in
three narrowing stages: a tree-like listing of files and directories, then a compressed
skeleton of each candidate file's class, function and variable declarations, and only then
the selected code itself (Xia et al., 2025). Measured against the ground-truth file,
prompting the model over that structure located the correct file 78.7 per cent of the time
against 67.7 per cent for embedding-based retrieval, and combining the two reached 81.7 per
cent (Xia et al., 2025). Figure 2 sets out the narrowing. Consequently, the productive move
is to give the model a map before giving it territory, because a map of the whole repository
costs less context than a sample of it and localises better.

<figure>
<svg class="dg" viewBox="0 0 620 268" role="img" aria-labelledby="ttl-funnel">
<title id="ttl-funnel">Three-stage narrowing from repository to supplied code</title>
<rect class="box" x="20" y="30" width="560" height="44"/>
<text class="tf" x="34" y="48">Stage 1</text>
<text class="t" x="34" y="66">tree of files and directories, whole repository, no bodies</text>
<path class="line" d="M 300 74 L 300 92"/><polygon class="arrow" points="300,98 296,87 304,87"/>
<rect class="box" x="90" y="98" width="420" height="44"/>
<text class="tf" x="104" y="116">Stage 2</text>
<text class="t" x="104" y="134">skeletons of candidate files: declarations only, no bodies</text>
<path class="line" d="M 300 142 L 300 160"/><polygon class="arrow" points="300,166 296,155 304,155"/>
<rect class="hot" x="170" y="166" width="260" height="44"/>
<text class="tf" x="184" y="184" style="fill:var(--paper)">Stage 3</text>
<text class="tr" x="184" y="202">the selected code, supplied in full</text>
<path class="rule" d="M 20 230 L 600 230"/>
<text class="tm" x="20" y="250">structure-first localisation 78.7%</text>
<text class="tm" x="250" y="250">embeddings 67.7%</text>
<text class="t" x="430" y="250">both combined 81.7%</text>
</svg>
<figcaption><span class="label">Figure 2</span> The three-stage narrowing used by the
localisation phase, with the reported ground-truth file-location accuracy for each retrieval
strategy beneath. The accuracies describe file-level localisation only and do not measure
whether the resulting patch was correct. Drawn from Xia et al. (2025).</figcaption>
</figure>

## The adjacency of useful cross-file context

The cross-file context that rescues a failed completion is concentrated in architecturally
adjacent files, but adjacency cannot be used directly as a retrieval rule. Zhang et al.
(2023) examined the snippets retrieved in cases where repository-level retrieval succeeded
and in-file context alone failed, and found that between 82 and 88 per cent came from files
sharing an import or a directory with the target. That result invites an obvious
optimisation, which the same authors tested and rejected. Zhang et al. (2023) report that
restricting retrieval in advance to structurally defined locations — imported files, the
same directory, similar imports, similar names — degraded performance relative to
unrestricted similarity search over the repository. Figure 3 sets out the asymmetry.
Accordingly, adjacency is a property of the answer rather than a method for finding it,
because the search that finds those files also finds the ones the structural rule excludes.

<figure>
<svg class="dg" viewBox="0 0 620 224" role="img" aria-labelledby="ttl-adj">
<title id="ttl-adj">Adjacency describes the retrieved set but does not improve retrieval</title>
<text class="tf" x="20" y="20">Where the rescuing snippets came from</text>
<rect class="hot" x="20" y="32" width="480" height="30"/>
<rect class="box" x="500" y="32" width="100" height="30"/>
<text class="tr" x="260" y="52" text-anchor="middle">shares an import or a directory with the target, 82-88%</text>
<text class="tm" x="550" y="52" text-anchor="middle">elsewhere</text>
<path class="rule" d="M 20 84 L 600 84"/>
<text class="tf" x="20" y="108">What happens when adjacency is imposed as the retrieval rule</text>
<rect class="box" x="20" y="122" width="270" height="60"/>
<text class="t" x="34" y="144">unrestricted similarity search</text>
<text class="tm" x="34" y="164">over the whole repository</text>
<rect class="box" x="330" y="122" width="270" height="60"/>
<text class="t" x="344" y="144">restricted to adjacent files</text>
<text class="tm" x="344" y="164">imports, directory, similar names</text>
<path class="line" d="M 290 152 L 324 152"/><polygon class="arrow" points="330,152 319,148 319,156"/>
<text class="tf" x="20" y="208">performance falls when the restriction is applied in advance</text>
</svg>
<figcaption><span class="label">Figure 3</span> The two findings that constrain how
adjacency may be used: the helpful snippets are overwhelmingly adjacent, yet imposing
adjacency as a retrieval filter lowers performance. The figure reports a completion
benchmark and does not claim the same asymmetry holds for issue resolution. Drawn from Zhang
et al. (2023).</figcaption>
</figure>

Two further limits on this result should be stated, because both bound how far it transfers.
Zhang et al. (2023) themselves report that the benefit of similarity-based repository retrieval is
contingent on intra-repository redundancy, and that repositories with low duplication yielded
markedly smaller gains than high-duplication ones. The same study found that additional
retrieval-generation iterations are not monotonically beneficial, since previously correct
samples were lost at every step of the iteration with one of the models tested (Zhang et al.,
2023). Therefore iterative retrieval should be treated as a technique with a measured
regression risk rather than as a free improvement, because the losses were observed in the
paper that proposed it.

## The coupling that version history reveals

Version history exposes couplings that static analysis cannot detect at all, and this has
been established for long enough to count as settled. Gall, Hajek and Jazayeri (1998)
introduced logical coupling, the relation between artefacts that change together across
releases regardless of whether any dependency links them. Zimmermann et al. (2004) built the
association-rule form of this over version-control transactions and reported that, given one
changed entity, a genuinely related further location appeared in the top three suggestions
more than seventy per cent of the time. Zimmermann et al. (2004) further report that the couplings recovered include ones no
compiler could find, among them cross-language interface and implementation pairs, and
relations between code and non-program artefacts such as documentation.
Figure 4 sets the two coupling relations against each other. In sum, co-change is a distinct
evidence source rather than an approximation of the dependency graph, because it detects
relations that have no representation in the graph.

<figure>
<svg class="dg" viewBox="0 0 620 262" role="img" aria-labelledby="ttl-cc">
<title id="ttl-cc">Two coupling relations over the same repository</title>
<text class="tf" x="20" y="20">Structural coupling</text>
<text class="tf" x="330" y="20">Evolutionary coupling</text>
<text class="tm" x="20" y="38">imports, calls, inheritance</text>
<text class="tm" x="330" y="38">files changed in the same commit</text>
<rect class="box" x="20" y="56" width="250" height="120"/>
<rect class="box" x="330" y="56" width="250" height="120"/>
<rect class="fill" x="40" y="76" width="80" height="26"/>
<rect class="fill" x="170" y="76" width="80" height="26"/>
<rect class="fill" x="40" y="132" width="80" height="26"/>
<path class="line" d="M 120 89 L 164 89"/><polygon class="arrow" points="170,89 159,85 159,93"/>
<path class="line" d="M 80 102 L 80 126"/><polygon class="arrow" points="80,132 76,121 84,121"/>
<text class="t" x="80" y="93" text-anchor="middle">parser.py</text>
<text class="t" x="210" y="93" text-anchor="middle">tokens.py</text>
<text class="t" x="80" y="149" text-anchor="middle">ast.py</text>
<text class="tf" x="170" y="149">schema.json</text>
<text class="tf" x="170" y="164">not reachable</text>
<rect class="fill" x="350" y="76" width="80" height="26"/>
<rect class="fill" x="480" y="76" width="80" height="26"/>
<rect class="fill" x="350" y="132" width="80" height="26"/>
<rect class="hot" x="480" y="132" width="80" height="26"/>
<path class="dash" d="M 430 89 L 480 89"/>
<path class="dash" d="M 390 102 L 390 132"/>
<path class="dash" d="M 430 145 L 480 145"/>
<text class="t" x="390" y="93" text-anchor="middle">parser.py</text>
<text class="t" x="520" y="93" text-anchor="middle">tokens.py</text>
<text class="t" x="390" y="149" text-anchor="middle">ast.py</text>
<text class="tr" x="520" y="149" text-anchor="middle">schema.json</text>
<path class="rule" d="M 20 196 L 600 196"/>
<text class="tm" x="20" y="216">top-three hit rate given one changed entity: over 70%</text>
<text class="tf" x="20" y="236">as a commit-time completeness check the same signal fires</text>
<text class="tf" x="20" y="252">correctly for only about 3% of incomplete changes</text>
</svg>
<figcaption><span class="label">Figure 4</span> The same four files under structural and
evolutionary coupling, with a data file that no dependency edge reaches but that changes
with the parser. The hit rate shown is for suggesting a further location given one already
changed, which is a different task from detecting an incomplete change, and the two have
very different measured performance. Drawn from Gall, Hajek and Jazayeri (1998) and
Zimmermann et al. (2004).</figcaption>
</figure>

The precision of co-change evidence is much weaker than its recall at the top of the list,
and the distinction governs what it can be used for. Zimmermann et al. (2004) report that at
fine granularity with permissive thresholds their method returned recommendations for only
sixty-six per cent of queries, and that the recommendations carried low absolute precision.
Used as a completeness check at commit time the signal is high-specificity and very
low-sensitivity, firing a correct warning for only around three per cent of incomplete-change
situations (Zimmermann et al., 2004). It must be noted that the method works substantially
better on transactions that only modify existing entities, where average recall almost
doubles to forty-four per cent, than on transactions that add or delete them (Zimmermann et
al., 2004). Ergo, co-change belongs in an agent workflow as a suggestion source for
candidate files, not as a gate, because a detector that misses ninety-seven per cent of cases
cannot be relied on to say that nothing was missed.

## The assembly of an agent context

Everything in this section is an extrapolation to a setting the cited studies did not
examine, and should be treated as a hypothesis rather than a finding.

### The order of assembly

The evidence supports assembling context in the same narrowing order that the localisation
result validates, rather than assembling it by relevance score alone. Xia et al. (2025)
establish the ordering empirically, and Jimenez et al. (2024) supply the reason to stop
adding material once the owning files are in, because unselected context lowered their
measured resolution rate.

| Step | What is supplied | Why |
| --- | --- | --- |
| 1 | The directory tree, filtered to source | Localising over structure beat embeddings, 78.7% against 67.7% |
| 2 | Declaration-level skeletons of candidate files | The stage that narrowed candidates without spending context on bodies |
| 3 | Full text of the files judged to own the change | The oracle condition that more than doubled resolution |
| 4 | Named descriptions, not contents, of stable callers | Added context degraded performance when it was not selected |

### The material to obtain from version history

A co-change query over the repository's own history is worth running before the file set is
fixed, because it surfaces the relations that no import graph contains. Gall, Hajek and
Jazayeri (1998) established that those relations exist, and Zimmermann et al. (2004)
established that a ranked list of them is accurate enough at the top to be worth reading. The practical form is
a single command whose output is pasted in as candidate files rather than as authority.

```bash
# Files that most often changed in the same commit as the target.
git log --format=%H --follow -- src/store.py \
  | while read -r c; do git show --name-only --format= "$c"; done \
  | sort | uniq -c | sort -rn | head -12
```

The output should be read as a list to check, not a list to include. Two of the twelve are
usually a lock file and a changelog, which are co-change artefacts of the release process
rather than of the design.

### The verification of the as-built structure

The structure an agent is given should be checked against the structure the repository
actually has, which is the reflexion procedure applied to a prompt. Murphy, Notkin and
Sullivan (1995) formalised the comparison of a high-level model against extracted source
information, classifying each relation as a convergence, a divergence, or an absence.
Murphy, Notkin and Sullivan (1995) intended the procedure for an engineer approaching an
unfamiliar system, and the same three categories apply to an instruction file that claims a layering the code no longer
obeys, and the divergences are precisely the places an agent will be misled. In sum, an
architectural claim in a prompt is a hypothesis about the code, because the code is free to
have drifted since the claim was written.

### A checklist for an assembled context

1. The files that own the change are supplied in full, and were chosen deliberately.
2. Everything else is a structure listing or a declaration skeleton, not a body.
3. Stable callers are described by name and calling pattern rather than pasted.
4. A co-change query has been run, and its output was checked rather than included.
5. Any layering or ownership claim in the instruction file has been checked against the
   current source, not assumed.
6. Nothing was added on the grounds that the window had room for it.

## Conclusion

It was first established that supplying the correct files more than doubles issue resolution
on a standard benchmark, and that the retriever used in that benchmark returns none of the
needed files in almost half of instances, which places a large share of failure before the
edit. Next, structure-first localisation was presented as measurably better than embedding
retrieval and complementary to it, with the narrowing from tree to skeleton to code as the
operative procedure. It was then shown that the cross-file context which rescues a failed
completion is overwhelmingly adjacent, and yet that imposing adjacency as a retrieval rule
lowers performance, so adjacency describes the answer without providing the method. Finally,
evolutionary coupling was presented as an evidence source that static analysis cannot
replicate, bounded by a precision that makes it a suggestion rather than a gate, and an
assembly procedure was constructed and marked as extrapolation. A common thread running
through these findings is that context is a selection problem rather than a capacity problem,
because every result above got worse when unselected material was added. As a next step, the
retrieval step in a practitioner's own workflow should be measured directly against known
answers, because none of the benchmarks cited was built from a repository the practitioner
maintains.

[The third note in this series](/blog/architectural-decisions-debt-and-verification/) takes
up what should be written down for an agent to read, and why a passing test suite is weaker
evidence than it appears.

## References

<ol class="refs">
<li>Gall, H., Hajek, K., &amp; Jazayeri, M. (1998). Detection of logical coupling based on product release history. <em>International Conference on Software Maintenance</em>, 190-198.</li>
<li>Jimenez, C. E., Yang, J., Wettig, A., Yao, S., Pei, K., Press, O., &amp; Narasimhan, K. (2024). SWE-bench: can language models resolve real-world GitHub issues? <em>International Conference on Learning Representations</em>. <a href="https://arxiv.org/abs/2310.06770">arXiv:2310.06770</a>.</li>
<li>Liu, N. F., Lin, K., Hewitt, J., Paranjape, A., Bevilacqua, M., Petroni, F., &amp; Liang, P. (2024). Lost in the middle: how language models use long contexts. <em>Transactions of the Association for Computational Linguistics</em>, 12, 157-173.</li>
<li>Murphy, G. C., Notkin, D., &amp; Sullivan, K. (1995). Software reflexion models: bridging the gap between source and high-level models. <em>ACM SIGSOFT Symposium on the Foundations of Software Engineering</em>, 18-28.</li>
<li>Xia, C. S., Deng, Y., Dunn, S., &amp; Zhang, L. (2025). Demystifying LLM-based software engineering agents. <em>Proceedings of the ACM on Software Engineering</em>. <a href="https://arxiv.org/abs/2407.01489">arXiv:2407.01489</a>.</li>
<li>Zhang, F., Chen, B., Zhang, Y., Keung, J., Liu, J., Zan, D., Mao, Y., Lou, J.-G., &amp; Chen, W. (2023). RepoCoder: repository-level code completion through iterative retrieval and generation. <em>Conference on Empirical Methods in Natural Language Processing</em>, 2471-2484.</li>
<li>Zimmermann, T., Weissgerber, P., Diehl, S., &amp; Zeller, A. (2004). Mining version histories to guide software changes. <em>International Conference on Software Engineering</em>, 563-572.</li>
</ol>
