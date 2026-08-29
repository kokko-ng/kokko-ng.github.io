---
title: "Agentic Coding x Mechanistic Interpretability pt. 3: Wording and Evaluation"
description: "Deduplicating an agent context, rewriting inverted instructions so they do not read like the case they invert, and an evaluation loop that tells a prompt line that works from one that is merely being carried."
pubDate: 2026-08-29
tags: ["mechanistic interpretability", "prompting", "agents"]
series:
  name: "Agentic Coding x Mechanistic Interpretability"
  part: 3
---

The following discussion maintains that the surface form of a prompt is a causal input to
which internal computation a model runs, and that the same literature establishing this
also bounds how confidently any prompting rule may be asserted. It will be shown that
reference resolution in the most studied circuit is driven by repetition structure rather
than by semantic role, and that perturbing repetition alone degrades the answer. Next, it
will be argued that a familiar surface form can recruit the computation associated with
that form even where the words request the opposite, which is established causally rather
than by inference. It will then be argued that model components are redundant and
self-repairing, with the consequence that explanations crediting a single component, or a
single prompt ingredient, are systematically unreliable. Following this, it will be argued
that circuit discovery is itself methodologically fragile by its own practitioners'
account, which bounds the standing of every finding in this series. Lastly, four practices will be set out in
detail — a deduplication pass over the assembled context, a rule for phrasing inverted
instructions, an evaluation loop for a prompt change, and a changelog for an instruction
file — and the substantial territory this review could not establish will be stated
explicitly rather than passed over.

## Reference resolution runs on repetition, not on role

Reference resolution in the most thoroughly studied circuit is keyed on which token
repeats rather than on which token plays the semantic role the task names. Wang et al.
(2023) decompose GPT-2 small's behaviour on indirect object identification into three
component classes, each named and individually located: duplicate token heads that mark
the name occurring twice, S-inhibition heads that "write in the query of the Name Mover
Heads" so as to remove that duplicate from their attention, and name mover heads that copy
whichever name remains. The decomposition was established by path patching into
the query specifically, rather than by observing correlations in attention maps, which is what makes it a causal account (Wang et al., 2023). The circuit as Wang et al. (2023) report it is presented in Figure 1.

<figure>
<svg class="dg" viewBox="0 0 620 320" role="img" aria-labelledby="ttl-ioi">
  <title id="ttl-ioi">The indirect object identification circuit</title>
  <text class="tf" x="20" y="20">Context</text>
  <rect class="box" x="20" y="30" width="486" height="30"/>
  <text class="t" x="32" y="50">When Mary and John went to the shop, John gave a drink to</text>
  <rect class="hot" x="512" y="30" width="88" height="30"/>
  <text class="tr" x="556" y="50" text-anchor="middle">Mary</text>
  <rect class="fill" x="20" y="96" width="176" height="52"/>
  <text class="tf" x="30" y="88">Duplicate token heads</text>
  <text class="t" x="30" y="118">mark the name that</text>
  <text class="t" x="30" y="134">occurs twice</text>
  <path class="line" d="M 202 122 L 240 122"/>
  <polygon class="arrow" points="246,122 236,118 236,126"/>
  <rect class="fill" x="246" y="96" width="176" height="52"/>
  <text class="tf" x="256" y="88">S-inhibition heads</text>
  <text class="t" x="256" y="118">write into the movers'</text>
  <text class="t" x="256" y="134">queries, suppressing it</text>
  <path class="line" d="M 428 122 L 466 122"/>
  <polygon class="arrow" points="472,122 462,118 462,126"/>
  <rect class="fill" x="472" y="96" width="128" height="52"/>
  <text class="tf" x="482" y="88">Name mover heads</text>
  <text class="t" x="482" y="118">copy whichever</text>
  <text class="t" x="482" y="134">name is left</text>
  <path class="dash" d="M 592 96 L 592 66"/>
  <polygon class="arrow" points="592,60 588,71 596,71"/>
  <text class="tf" x="20" y="196">What the circuit is keyed on</text>
  <text class="tm" x="20" y="220">The answer is selected by which name repeats, not by which name is the</text>
  <text class="tm" x="20" y="236">indirect object. Adding a sentence that duplicates the intended answer</text>
  <text class="tm" x="20" y="252">drops the logit difference from 3.55 to 1.23 and raises error from 0.7% to</text>
  <text class="tm" x="20" y="268">23.4%; adding a third copy of the distractor instead does no harm.</text>
  <line class="rule" x1="20" y1="288" x2="600" y2="288"/>
  <text class="tf" x="20" y="308">GPT-2 small, templated task — Wang et al. (2023), Figure 8</text>
</svg><figcaption><span class="label">Figure 1</span> The circuit as reported, with the
adversarial result that bears on prompting. The three component classes are named in
Wang et al. (2023) with individual heads identified; the figure omits those identifiers
because the argument here turns on the routing, not on which head occupies which slot.
Note that the mechanism selects an answer by elimination of the repeated name, which is why
altering repetition alone is sufficient to alter the answer.</figcaption>
</figure>

The consequence for practitioners is established by an adversarial manipulation rather
than by extrapolation from the circuit diagram. Wang et al. (2023) report a baseline logit
difference of 3.55 with an error rate of 0.7 per cent; adding a natural sentence that
duplicates the *intended answer* drops the logit difference to 1.23 and raises the error
rate to 23.4 per cent, whereas a matched control that instead adds a third occurrence of
the distractor leaves performance intact at 3.64 and 0.4 per cent. Because the two manipulations are
matched in length and in kind and differ only in which token they duplicate, the
degradation is attributable to repetition structure rather than to added context in general
(Wang et al., 2023).

The result has replicated, and has generalised in a way that strengthens the interpretation
offered here (Conmy et al., 2023; Tigges et al., 2024). Conmy et al. (2023) rediscover the circuit by an automated method rather
than by hand; Tigges et al. (2024) find the same algorithm across the Pythia family from
160M to 2.8B parameters and across training; and Merullo et al. (2024) find the same
inhibition and mover machinery reused on an unrelated coloured-objects task, which is
itself evidence that the mechanism is repetition and position routing rather than anything
specific to indirect objects. Furthermore, Nainani et al. (2024) examine the circuit across prompt variants, including one
that duplicates the indirect object, and find that it reuses all of its components while
adding input edges, identifying a further mechanism they name S2 hacking — which indicates
that the routing adapts to the repetition structure rather than simply failing when that
structure changes.

It must be noted that the ceiling on this claim is low in three respects. The model is
GPT-2 small at 117 million parameters on a synthetic templated task; the inhibition signal
decomposes into a token component and a position component, so the mechanism is partly
"which slot repeated" rather than purely "which token repeated"; and an error rate of 23.4
per cent is substantial degradation rather than collapse. Moreover, Miller, Chughtai and
Saunders (2024) dispute this circuit's reported faithfulness and its component membership,
though not the behavioural result relied on here. Accordingly, the defensible statement is that
repetition structure is a causal input to reference resolution in a small model (Wang et
al., 2023; Nainani et al., 2024), and that its consequence at agent scale is untested.

## A familiar surface form recruits a familiar computation

A prompt that looks like a familiar template can recruit the computation associated with
that template even where the words ask for the opposite, and this has been demonstrated
causally rather than inferred. Hanna, Liu and Variengien (2023) identify the circuit by
which GPT-2 small completes year spans, in which attention heads communicate the start
year into the residual stream and, in the authors' words, "MLPs 9, 10, and 11 appear to
compute the greater-than operation in tandem, and in steps". Having established the circuit on the case it was built for, the authors then examine
prompts that invert the relation while preserving its surface shape. Figure 2 shows the overgeneralisation this exposes (Wang et al., 2023).

<figure>
<svg class="dg" viewBox="0 0 620 300" role="img" aria-labelledby="ttl-gt">
  <title id="ttl-gt">The same circuit, recruited by surface form rather than by meaning</title>
  <text class="tf" x="20" y="22">The case the circuit was built for</text>
  <rect class="box" x="20" y="32" width="440" height="30"/>
  <text class="t" x="32" y="52">The war lasted from the year 1732 to the year 17</text>
  <path class="line" d="M 466 47 L 500 47"/>
  <polygon class="arrow" points="506,47 496,43 496,51"/>
  <rect class="fill" x="506" y="32" width="94" height="30"/>
  <text class="t" x="553" y="52" text-anchor="middle">&gt; 32</text>
  <text class="tf" x="506" y="78">correct</text>
  <text class="tf" x="20" y="128">The inverted case</text>
  <rect class="box" x="20" y="138" width="440" height="30"/>
  <text class="t" x="32" y="158">The war ended in the year 1732 and started in the year 17</text>
  <path class="line" d="M 466 153 L 500 153"/>
  <polygon class="arrow" points="506,153 496,149 496,157"/>
  <rect class="hot" x="506" y="138" width="94" height="30"/>
  <text class="tr" x="553" y="158" text-anchor="middle">&gt; 32</text>
  <text class="tf" x="506" y="184">wrong</text>
  <path class="dash" d="M 240 68 L 240 100 L 240 134"/>
  <text class="tm" x="252" y="106">the same circuit fires</text>
  <line class="rule" x1="20" y1="214" x2="600" y2="214"/>
  <text class="tm" x="20" y="238">The model ought to predict a number smaller than 32 and does not. Impeding the</text>
  <text class="tm" x="20" y="254">circuit's components improves performance here, which is causal evidence that the</text>
  <text class="tm" x="20" y="270">circuit is producing the wrong answer rather than failing to engage.</text>
  <text class="tf" x="20" y="292">GPT-2 small — Hanna, Liu and Variengien (2023), Section 5</text>
</svg><figcaption><span class="label">Figure 2</span> The overgeneralisation reported in
Section 5 of Hanna, Liu and Variengien (2023). Both prompts share a surface form; only the
second inverts the relation the words describe. The figure shows the direction of the
error, not its magnitude, and the source describes this section of its analysis as
primarily qualitative.</figcaption>
</figure>

The authors state the finding without hedging: on such prompts "GPT-2 ought to predict
numbers smaller than YY; however, it predicts numbers greater than YY. This is because it
is using the exact same circuit used in the greater than case! GPT-2 thus overgeneralizes
the use of our circuit." Two pieces of evidence support the attribution. Path-patching
plots in the appendix resemble those of the original year-span task, and impeding the
circuit's components *improves* performance on the inverted prompts, which is causal
evidence that the circuit is producing the wrong answer rather than merely failing to
engage. In addition, Shi et al. (2024) find the indirect object and greater-than circuits
significantly more faithful than random circuits, which supports treating them as real
structure rather than as artefacts of the discovery procedure.

<aside class="note"><p>The practical reading is narrow. The claim is that surface form was
sufficient to recruit the wrong computation in one documented case, not that surface form
generally determines which computation runs. The stronger, more useful generalisation is
exactly the one the evidence does not carry.</p></aside>

It must be noted that Hanna, Liu and Variengien (2023) themselves describe their evidence
as lying somewhere between generalisation and memorisation, and allow that the circuit
"could function internally as a lookup table"; that MLP 11 additionally enforces a prior
over plausible durations rather than performing a pure comparison; and that the model is
again GPT-2 small. In short, the finding establishes that surface form can be sufficient to misdirect
computation, and does not establish how often it is (Hanna, Liu and Variengien, 2023).

## Redundancy defeats single-component explanations

Model components are redundant to a degree that undermines explanations crediting any one
of them, which is the most epistemically consequential finding in this series. Wang et al.
(2023) report that when they knocked out all of the name mover heads at once — the
components that literally write the answer — "the circuit still worked (only 5% drop in
logit difference)", because other heads compensated by replacing their role, and the authors conclude that
this "complicates the search for complete mechanisms". The accounting behind that
near-zero net effect, as McGrath et al. (2023) set it out, is presented in Figure 3.

<figure>
<svg class="dg" viewBox="0 0 620 250" role="img" aria-labelledby="ttl-sr">
  <title id="ttl-sr">Self-repair: ablating a component understates its apparent role</title>
  <line class="rule" x1="150" y1="196" x2="580" y2="196"/>
  <rect class="hot" x="180" y="56" width="66" height="140"/>
  <text class="tf" x="213" y="216" text-anchor="middle">head H</text>
  <text class="tm" x="213" y="46" text-anchor="middle">contribution</text>
  <rect class="hot" x="330" y="146" width="66" height="50"/>
  <rect class="fill" x="330" y="56" width="66" height="90"/>
  <text class="tf" x="363" y="216" text-anchor="middle">H ablated</text>
  <text class="tm" x="363" y="46" text-anchor="middle">recovered by other heads</text>
  <rect class="hot" x="480" y="146" width="66" height="50"/>
  <text class="tf" x="513" y="216" text-anchor="middle">net change</text>
  <text class="tm" x="513" y="136" text-anchor="middle">what you measure</text>
  <path class="dash" d="M 246 56 L 330 56"/>
  <path class="dash" d="M 396 146 L 480 146"/>
  <text class="tf" x="20" y="126">effect on the</text>
  <text class="tf" x="20" y="140">output logit</text>
</svg><figcaption><span class="label">Figure 3</span> The accounting behind the result. The
component's direct contribution is large, but most of it is recovered by other components
once it is removed, so the measured change understates the role the component was playing.
Two details in the source qualify the picture and are not visible in the diagram: the
compensating heads were not dormant beforehand, and the ablations are mean ablations rather
than zero ablations. Drawn from Wang et al. (2023), Section 3.4 and Appendix F.</figcaption>
</figure>

Two corrections to the popular reading of this result are required by the source itself.
The compensating heads were not dormant before the knockout, since Wang et al. (2023)
report in their appendix that they already affected the logit difference slightly
positively and that several already exhibited mover-like attention patterns; and the
count of eight such heads is a threshold artefact, the authors having "arbitrarily chose to
keep the eight heads" whose effect size exceeded two per cent. Furthermore, all of the
knockouts are mean ablations rather than zero ablations, which is a different intervention
with different semantics.

The phenomenon replicates but does not generalise as cleanly as the headline figure
implies. McGrath et al. (2023) independently document compensatory self-repair in a
different model under the name of the hydra effect. However, Rushing and Nanda (2024) show
that self-repair measured on the full pretraining distribution is imperfect, noisy and
sometimes overcorrecting, and that it is partly mechanical, arising from final-layer
normalisation rescaling together with a sparse population of anti-erasure neurons.
Consequently, the five per cent figure is specific to that task and that ablation method
and must not be quoted as a general rate (Rushing and Nanda, 2024); what generalises is the
qualitative point that ablation-based attribution understates the mechanisms available to a
model (McGrath et al., 2023).

## The discovery methods are themselves fragile

Circuit findings are bounded by the fragility of the methods that produce them, a
limitation stated most plainly by the authors of the leading automated method. Conmy et
al. (2023) report in the body of their paper that "methods are very sensitive to the
corrupted distribution" and that "ACDC is not robust, and it fails at some settings",
illustrating the point with a task on which their method performs poorly under
corrupted-activation patching yet recovers the circuit perfectly at any threshold when
activations are patched with zeros instead. The same authors concede that their
ground truth "is not 100% reliable, limiting the strength of the conclusions".

<aside class="note"><p>This quotation is body text rather than abstract, in the section
discussing the method's own evaluation. A reader who takes the abstract as the summary of
what the paper found will come away with a materially more confident picture than the
paper supports.</p></aside>

Independent work sharpens the concern rather than dispelling it. Miller, Chughtai and
Saunders (2024) find that circuit faithfulness measurements are "highly sensitive to
seemingly insignificant changes in the ablation methodology" and that the indirect object
and docstring circuits are much less faithful than originally reported. Syed, Rager and
Conmy (2024) show that a different attribution method outperforms the automated approach
above, which qualifies its standing without contradicting the non-robustness result.
Therefore, any prompting rule justified on the grounds that the circuit for some task works
in a particular way inherits this fragility, and should be held with correspondingly less
confidence than the underlying behavioural result on which it rests (Conmy et al., 2023;
Miller, Chughtai and Saunders, 2024).

## The practice these results support

The recommendations below follow from the behavioural results rather than from the circuit
diagrams, because the behavioural results are the more robust half of each finding (Miller, Chughtai
and Saunders, 2024). Figure 4 sets the four properties of a prompt this review can speak to against the one it
cannot (Miller, Chughtai & Saunders, 2024).

<figure>
<svg class="dg" viewBox="0 0 620 274" role="img" aria-labelledby="ttl-lad">
  <title id="ttl-lad">Prompt properties ranked by the evidence behind them</title>
  <text class="tf" x="20" y="26">Descending order of evidential support</text>
  <rect class="hot" x="60" y="46" width="328" height="34" opacity="1.00"/>
  <text class="t" x="402" y="62">what is in the context</text>
  <text class="tf" x="402" y="76">retrieval heads, function vectors</text>
  <rect class="hot" x="60" y="98" width="250" height="34" opacity="0.77"/>
  <text class="t" x="324" y="114">where it sits in the context</text>
  <text class="tf" x="324" y="128">position held constant, order permuted</text>
  <rect class="hot" x="60" y="150" width="178" height="34" opacity="0.56"/>
  <text class="t" x="252" y="166">its surface form and repetition</text>
  <text class="tf" x="252" y="180">IOI adversarial, greater-than misfire</text>
  <rect class="dash" x="60.5" y="202.5" width="106" height="33"/>
  <text class="t" x="180" y="218">how the model is addressed</text>
  <text class="tf" x="180" y="232">not assessed in this review</text>
  <line class="rule" x1="60" y1="36" x2="60" y2="258"/>
</svg><figcaption><span class="label">Figure 4</span> The four properties of a prompt that this
series examined, ordered by the strength of the evidence behind them. The bottom rung is
drawn as an outline because no verified finding in this review bears on it, which is a
statement about the review rather than a finding about the property.</figcaption>
</figure>

### Duplicate identifiers in an agent context

Because reference resolution in the studied circuit is keyed on which token repeats (Wang
et al., 2023), a duplicated identifier is an active perturbation rather than neutral
filler. The duplicates that arise in a coding agent's context are predictable, and most of
them are removable.

| Common duplicate | Where it comes from | Remedy |
| --- | --- | --- |
| Two versions of one function | Pasting the file before and after an edit | Supply the current version only, plus a diff |
| The same symbol in several files | Broad grep output pasted whole | Paste the matching lines, not the files |
| Repeated paths in a listing | `find` or `tree` output left unfiltered | List only the paths in play |
| The task restated three ways | Accumulated turns of clarification | Restate once, in final form |
| A test and its copied-out failure | Pasting both the test and the runner output | Keep the failure output, cite the test path |

The practice that follows from Wang et al. (2023) is to pass the assembled context through
a duplication check before sending it, in the same spirit as the existence check in the second note.

```bash
# Identifiers appearing in more than one distinct block of the assembled context.
awk '/^--- /{blk=$0} /[A-Za-z_][A-Za-z0-9_]{4,}/{
       for (i=1;i<=NF;i++) if ($i ~ /^[A-Za-z_][A-Za-z0-9_]{4,}$/) seen[$i","blk]=1
     }
     END{ for (k in seen){ split(k,a,","); c[a[1]]++ }
          for (s in c) if (c[s]>2) print c[s], s }' context.txt | sort -rn | head -20
```

It must be noted that this is a second-order extrapolation with no direct empirical support
at any scale, and that Nainani et al. (2024) find the circuit adapts to changed repetition
structure rather than simply failing. Accordingly, deduplication is offered as the most
testable of the hypotheses here, and as a practice that costs nothing even if the mechanism
turns out not to transfer.

### The phrasing of an inverted instruction

Hanna, Liu and Variengien (2023) establish that a familiar surface form was sufficient to
recruit a familiar computation on a prompt whose words inverted the relation. The practice
this suggests is to restate an unusual operation in its own terms rather than as a minimal
negation of the common one, and the rewrites below follow the same pattern in each case:
name the set, then act on it.

```text
Weak                                   Stronger
-----------------------------------    -----------------------------------------------
Delete the files that do NOT match     List the files under internal/ whose paths do not
internal/**/*_test.go                  end in _test.go. Print that list. Delete only the
                                       files on it.

Roll back to the earlier version       Check out parse.go at commit a1b2c3d into the
                                       working tree. Do not revert any other file.

Do not add any new dependencies        Before editing, record the contents of go.mod.
                                       After editing, assert that go.mod is byte-identical.

Skip the tests that are already        Run the full suite once. Collect the names that
passing                                failed. Re-run only those names.
```

Each stronger form has two properties, both of them responses to the surface-form result
of Wang et al. (2023): the operation is expressed positively, over an explicitly
constructed set, and the check is mechanical rather than a matter of the agent
remembering a prohibition. Consequently, the instruction no longer depends on the model
resisting the pull of the more common template.

### An evaluation loop for a prompt change

The self-repair result is the reason prompt-ingredient attribution requires controlled
repeats rather than single observations. Because redundant internal pathways mean a prompt
can succeed for reasons unrelated to the cue a practitioner credits, and that removing an
apparently load-bearing instruction may cost far less than expected (Wang et al., 2023;
McGrath et al., 2023), the widespread practice of adding a line, observing an improvement and retaining the line
indefinitely is unsound by construction. The loop that the self-repair result argues for
instead is presented in Figure 5.

<figure>
<svg class="dg" viewBox="0 0 620 236" role="img" aria-labelledby="ttl-loop">
<title id="ttl-loop">An evaluation loop for a change to a prompt</title>
<rect class="box" x="20" y="52" width="112" height="46"/>
<text class="t" x="76" y="72" text-anchor="middle">held-out</text>
<text class="t" x="76" y="87" text-anchor="middle">task set</text>
<path class="line" d="M 138 75 L 158 75"/><polygon class="arrow" points="164,75 154,71 154,79"/>
<rect class="fill" x="164" y="52" width="112" height="46"/>
<text class="t" x="220" y="72" text-anchor="middle">baseline,</text>
<text class="t" x="220" y="87" text-anchor="middle">k runs</text>
<path class="line" d="M 282 75 L 302 75"/><polygon class="arrow" points="308,75 298,71 298,79"/>
<rect class="fill" x="308" y="52" width="112" height="46"/>
<text class="t" x="364" y="72" text-anchor="middle">with the</text>
<text class="t" x="364" y="87" text-anchor="middle">change, k runs</text>
<path class="line" d="M 426 75 L 446 75"/><polygon class="arrow" points="452,75 442,71 442,79"/>
<rect class="box" x="452" y="46" width="148" height="58"/>
<text class="t" x="526" y="68" text-anchor="middle">is the gap larger</text>
<text class="t" x="526" y="83" text-anchor="middle">than the spread</text>
<text class="t" x="526" y="98" text-anchor="middle">across the k runs?</text>
<path class="line" d="M 500 108 L 500 138"/><polygon class="arrow" points="500,144 496,133 504,133"/>
<rect class="hot" x="440" y="144" width="72" height="32"/>
<text class="tr" x="476" y="164" text-anchor="middle">keep</text>
<path class="line" d="M 560 108 L 560 138"/><polygon class="arrow" points="560,144 556,133 564,133"/>
<rect class="box" x="528" y="144" width="72" height="32"/>
<text class="t" x="564" y="164" text-anchor="middle">drop</text>
<text class="tf" x="492" y="132" text-anchor="end">yes</text>
<text class="tf" x="570" y="132">no</text>
<text class="tm" x="20" y="212">A single run cannot distinguish a change that helped from one the model</text>
<text class="tm" x="20" y="226">compensated for; the spread across k runs is the only available yardstick.</text>
</svg>
<figcaption><span class="label">Figure 5</span> The loop the self-repair result argues for.
The comparison that matters is between the size of the change and the run-to-run spread of
the baseline, not between one run before and one run after. The figure encodes the
recommended procedure and is not drawn from any cited experiment.</figcaption>
</figure>

In practice the self-repair result of McGrath et al. (2023) means three things. Firstly, a held-out set of representative tasks is the
artefact worth building, and it is worth more than any individual prompt line. Secondly,
`k` should be large enough that the run-to-run spread is visible, since a change smaller
than that spread is indistinguishable from noise. Thirdly, and least often done, the line
should periodically be removed again: a prompt accumulates instructions that were never
load-bearing, and only ablation reveals them.

```text
Prompt change protocol

  1. Fix a set of 15-30 tasks that resemble the real workload. Do not tune on them.
  2. Record baseline pass rate over k >= 5 runs. Record the spread, not only the mean.
  3. Make exactly one change.
  4. Re-run k times. Compare the difference against the baseline spread.
  5. If kept, add a dated line to the changelog stating what was measured.
  6. Every few months, remove each line in turn and re-measure. Delete what does not pay.
```

### A changelog for an instruction file

The final practice follows from the fragility of the discovery methods rather than from any
single result. Since a mechanistic finding is a generator of hypotheses rather than a
settled constraint (Conmy et al., 2023), the reason a line exists should be recorded next to
it, so that a later reader can tell a measured effect from an inherited superstition.

```markdown
<!-- CHANGELOG
2026-03-04  Added the table-driven test example.
            +18pts on the 22-task set over 5 runs; baseline spread 6pts. Kept.
2026-03-19  Added "think carefully before editing".
            +2pts, baseline spread 7pts. Not distinguishable from noise. Removed.
2026-04-02  Moved acceptance criteria from the middle to the top of the file.
            +9pts, spread 6pts. Kept, consistent with the positional evidence.
-->
```

An instruction file maintained this way tends to shrink rather than grow, which is the
opposite of the usual trajectory and, given the redundancy McGrath et al. (2023) report,
is the clearest practical consequence of taking the
self-repair result seriously.

## What this review could not establish

A substantial part of the territory this series set out to cover produced no claim that
survived verification, and stating which part is a condition of the rest being credible.
No verified finding was obtained on superposition, polysemanticity or the linear
representation hypothesis; on sparse autoencoders and the evaluation critiques directed at
them; on attention sinks and massive activations; on copy suppression and negative heads;
on refusal as a single mediating direction; on the faithfulness of chain-of-thought
reasoning and post-hoc rationalisation; on instruction hierarchy and the mechanisms behind
prompt injection; on knowledge localisation through multi-layer perceptron key-value
memories and the critique that localisation does not imply editability; on entity and
knowledge-boundary representations relevant to hallucination; on sycophancy; on tokenizer
and delimiter effects specific to code; or on the null results concerning persona
prompting, politeness and threats.

That last omission is worth naming precisely, because debunking prompting folklore was an
explicit aim. The absence of a verified claim above means that the topic was not
established in this review, and not that the folklore has been vindicated or refuted. A
reader wanting a position on whether politeness or persona assignment changes model
behaviour will not find it supported here, and should be sceptical of any account —
including a confident debunking — that does not show its evidence.

<div class="tenet">
<p class="label">The scale gap, stated once</p>
<p>Every finding in this series rests on models far smaller and simpler than a production
coding agent: GPT-2 small at 117 million parameters for the indirect object and
greater-than circuits, GPT-J and Llama-2 for function vectors, open-weight models of the
2023 to 2024 generation for retrieval heads and position. The tasks are templated — name
completion, year spans, antonyms, needle-in-a-haystack retrieval. No verified finding
studied a tool-using, long-horizon coding agent, and every prompting recommendation across
these three notes is therefore an extrapolation across both scale and task.</p>
</div>

## Conclusion

It was first established that reference resolution in the most studied circuit is keyed on
repetition structure rather than on semantic role, and that duplicating the intended
answer degrades performance while a matched duplication of the distractor does not. Next,
it was shown that a familiar surface form can recruit a familiar computation even where the
words invert the relation, with the attribution supported causally by the observation that
impeding the circuit improves performance on the inverted case. It was then argued that
components are redundant and self-repairing, so that ablation-based attribution
systematically understates the mechanisms available to a model, and that the widely quoted
five per cent figure is specific to its task and ablation method. Following this, it was
shown that circuit discovery is fragile by its own practitioners' account, which bounds
every recommendation resting on it. Finally, four practices were set out — deduplicating the
context, restating inverted instructions positively over an explicit set, measuring a prompt
change against the run-to-run spread, and recording why each line survives — and the
considerable territory this review could not establish was stated in full.

A common thread running through all three notes — [the first](/blog/induction-heads-function-vectors-and-demonstrations/) on induction heads and
function vectors, [the second](/blog/position-retrieval-heads-and-context-ordering/) on position and retrieval heads — is that the mechanisms are narrow, the
behavioural results are broader and more robust than the mechanistic ones, and the popular
prompting advice derived from this literature is broader than either. The findings that
survive scrutiny concern what is in a context, where it sits, and what surface form it
takes; they do not concern how a model is addressed, and the confident advice in
circulation about the latter draws no support from the work reviewed here.

The useful move for a practitioner is therefore not to adopt the recommendations in these
notes but to assemble a held-out set of representative tasks, run each prompt variant
across repeated samples, and compare the difference against the run-to-run spread, because
that procedure converts every claim above from an extrapolation into a measurement.

## References

<ol class="refs">
<li>Conmy, A., Mavor-Parker, A. N., Lynch, A., Heimersheim, S., &amp; Garriga-Alonso, A. (2023). Towards automated circuit discovery for mechanistic interpretability. <em>Advances in Neural Information Processing Systems 36</em>. <a href="https://arxiv.org/abs/2304.14997">arXiv:2304.14997</a>.</li>
<li>Hanna, M., Liu, O., &amp; Variengien, A. (2023). How does GPT-2 compute greater-than? Interpreting mathematical abilities in a pre-trained language model. <em>Advances in Neural Information Processing Systems 36</em>. <a href="https://arxiv.org/abs/2305.00586">arXiv:2305.00586</a>.</li>
<li>McGrath, T., Rahtz, M., Kramar, J., Mikulik, V., &amp; Legg, S. (2023). The hydra effect: emergent self-repair in language model computations. <a href="https://arxiv.org/abs/2307.15771">arXiv:2307.15771</a>.</li>
<li>Merullo, J., Eickhoff, C., &amp; Pavlick, E. (2024). Circuit component reuse across tasks in transformer language models. <em>International Conference on Learning Representations</em>.</li>
<li>Miller, J., Chughtai, B., &amp; Saunders, W. (2024). Transformer circuit faithfulness metrics are not robust. <em>Conference on Language Modeling</em>. <a href="https://arxiv.org/abs/2407.08734">arXiv:2407.08734</a>.</li>
<li>Nainani, J., Vaidyanathan, S., Yeung, A., Gupta, K., &amp; Jensen, D. (2024). Adaptive circuit behavior and generalization in mechanistic interpretability. <a href="https://arxiv.org/abs/2411.16105">arXiv:2411.16105</a>.</li>
<li>Rushing, C., &amp; Nanda, N. (2024). Explorations of self-repair in language models. <em>International Conference on Machine Learning</em>. <a href="https://arxiv.org/abs/2402.15390">arXiv:2402.15390</a>.</li>
<li>Shi, C., Beltran-Velez, N., Nazaret, A., Zheng, C., Garriga-Alonso, A., Jesson, A., et al. (2024). Hypothesis testing the circuit hypothesis in LLMs. <em>Advances in Neural Information Processing Systems 37</em>. <a href="https://arxiv.org/abs/2410.13032">arXiv:2410.13032</a>.</li>
<li>Syed, A., Rager, C., &amp; Conmy, A. (2024). Attribution patching outperforms automated circuit discovery. <em>BlackboxNLP at EMNLP 2024</em>.</li>
<li>Tigges, C., Hanna, M., Yu, Q., &amp; Biderman, S. (2024). LLM circuit analyses are consistent across training and scale. <em>Advances in Neural Information Processing Systems 37</em>.</li>
<li>Wang, K., Variengien, A., Conmy, A., Shlegeris, B., &amp; Steinhardt, J. (2023). Interpretability in the wild: a circuit for indirect object identification in GPT-2 small. <em>International Conference on Learning Representations</em>. <a href="https://arxiv.org/abs/2211.00593">arXiv:2211.00593</a>.</li>
</ol>
