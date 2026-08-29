---
title: "Induction Heads, Function Vectors and Why Demonstrations Work"
description: "Two replicated mechanisms account for part of why in-context examples work, and they license a narrower set of recommendations for agentic coding prompts than the folklore assumes. First of three."
pubDate: 2026-08-29
tags: ["mechanistic interpretability", "prompting", "agents"]
---

The following discussion maintains that the mechanistic interpretability literature
supports a narrow but genuine set of recommendations about how demonstrations should be
written into an agentic coding prompt, and that the popular inference drawn from that
literature — that in-context learning is essentially pattern completion — is stronger
than the evidence permits. It will be shown that induction heads are a replicated,
causally tested mechanism for literal pattern completion, defined by what they do
mechanically rather than by the task they assist. Next, it will be argued that the
further step from induction heads to in-context learning in general is the original
authors' own hypothesis and is now contested by direct evidence. It will then be argued
that function vectors offer a better-supported account of what a handful of
demonstrations installs, namely a compact and portable encoding of the task itself.
Lastly, the prompting recommendations these two mechanisms license will be set out, and
separated from the recommendations they do not. It should be noted at the outset that
none of the studies cited here was conducted on a long-horizon, tool-using coding agent,
and that every prompting recommendation below is therefore an extrapolation, marked as
such where it appears.

## What an induction head is defined by

An induction head is defined by its mechanical behaviour rather than by the task it
contributes to, and that definitional choice is the reason the finding has replicated
across models and laboratories. Olsson et al. (2022) specify the mechanism as the
conjunction of two properties: prefix matching, in which "the head attends back to
previous tokens that were followed by the current and/or recent tokens", and copying, in
which "the head's output increases the logit corresponding to the attended-to token".
Neither property refers to meaning, to task, or to instruction (Olsson et al., 2022). Consequently, a head
either satisfies the definition on a given input or it does not, and any laboratory with
access to a model's attention patterns can check the question independently.

<figure>
<svg class="dg" viewBox="0 0 620 296" role="img" aria-labelledby="ttl-ind">
  <title id="ttl-ind">The induction head circuit</title>
  <text class="tf" x="20" y="22">Layer L — induction head</text>
  <path class="line" d="M 403 124 C 403 52, 145 52, 145 124"/>
  <polygon class="arrow" points="145,130 141,119 149,119"/>
  <text class="tm" x="274" y="104" text-anchor="middle">attends to the position whose</text>
  <text class="tm" x="274" y="119" text-anchor="middle">previous token matches this one</text>
  <text class="tf" x="59"  y="145" text-anchor="middle">A</text>
  <text class="tf" x="145" y="145" text-anchor="middle">B</text>
  <text class="tf" x="403" y="145" text-anchor="middle">A</text>
  <text class="tf" x="489" y="145" text-anchor="middle">predicted B</text>
  <rect class="box"  x="20"  y="154" width="78" height="30"/>
  <rect class="fill" x="106" y="154" width="78" height="30"/>
  <rect class="box"  x="192" y="154" width="78" height="30"/>
  <rect class="box"  x="278" y="154" width="78" height="30"/>
  <rect class="fill" x="364" y="154" width="78" height="30"/>
  <rect class="hot"  x="450" y="154" width="78" height="30"/>
  <text class="t"  x="59"  y="174" text-anchor="middle">timeout</text>
  <text class="t"  x="145" y="174" text-anchor="middle">30</text>
  <text class="t"  x="231" y="174" text-anchor="middle">retries</text>
  <text class="t"  x="317" y="174" text-anchor="middle">5</text>
  <text class="t"  x="403" y="174" text-anchor="middle">timeout</text>
  <text class="tr" x="489" y="174" text-anchor="middle">30</text>
  <path class="line" d="M 145 190 C 145 238, 59 238, 59 190"/>
  <polygon class="arrow" points="59,184 55,195 63,195"/>
  <text class="tm" x="168" y="232">writes "my previous token was timeout"</text>
  <text class="tf" x="20" y="288">Layer L−1 — previous-token head</text>
</svg>
<figcaption><span class="label">Figure 1</span> The two-layer composition that implements
literal pattern completion. A previous-token head in the earlier layer records, at each
position, which token preceded it; the induction head in the later layer uses that record
to find the earlier occurrence of the current token and copies whatever followed it. The
diagram shows the minimal <code>[A][B] … [A] → [B]</code> case only, which is the case the
operational definition covers; it is not a claim about how the mechanism behaves on
longer or noisier patterns. Drawn from the mechanism as specified in Olsson et al. (2022).</figcaption>
</figure>

Three lines of evidence support the mechanism beyond mere identification. Firstly, Olsson
et al. (2022) report a discrete phase change during training, in which induction heads
form abruptly and the model's ability to use long contexts improves in the same narrow
window. Secondly, the same authors report that "when we directly 'knock out' induction
heads at test-time in small models, the amount of in-context learning greatly decreases",
which establishes the relationship as causal rather than merely correlational in that
regime. Thirdly, the finding has been reproduced independently: Bietti et al. (2023) and
Reddy (2024) both recover the abrupt formation of the induction circuit driving an abrupt
onset of in-context learning, and Crosbie and Shutova (2025) replicate the
prefix-matching and copying identification in substantially larger models, namely
Llama-3-8B and InternLM2-20B.

It must be noted that the evidence is weaker than the summary above suggests in three
specific respects, all of them conceded by the original authors. The measure Olsson et
al. (2022) use is an in-context learning score defined as the difference between the loss
at the five-hundredth token and the loss at the fiftieth, which is a proxy for a model's
use of context rather than a measure of accuracy on any task a practitioner cares about.
The strong causal evidence is confined to small, attention-only models; for larger models
containing multi-layer perceptrons, the authors state that they present correlational
evidence, and describe their results as "only the beginnings of evidence". Accordingly, the mechanism should be treated as
established, while the strength of its contribution in any particular large model should
be treated as an open quantity (Olsson et al., 2022; Yin and Steinhardt, 2025).

## The contested step from a mechanism to an explanation

The inference from induction heads to in-context learning in general is a separate and
much weaker claim than the mechanism itself, and it is now contested by direct evidence.
Olsson et al. (2022) themselves advance it as a hypothesis rather than a result,
proposing that some fuzzy or nearest-neighbour generalisation of prefix matching and
copying might account for the majority of in-context learning in large models. Yin and
Steinhardt (2025) test that proposition and find against it: in larger models, few-shot
in-context learning is driven primarily by a different population of heads, and ablating
induction heads produces an effect close to that of ablating an equal number of random
heads. Consequently, the widely repeated claim that in-context learning *is* induction is
not supported, and a prompting recommendation resting on it inherits that weakness.

<aside class="note"><p>The distinction matters practically. If in-context learning were
literal pattern completion, the right move would be to maximise surface similarity between
the examples and the desired output. If it is task encoding, the right move is to maximise
the clarity and consistency of the task the examples exhibit. These recommendations
diverge as soon as the desired output is not a near-copy of an example.</p></aside>

## What a handful of demonstrations installs

A better-supported account of what demonstrations do is that they install a compact,
portable encoding of the task, which can be extracted and transplanted. Todd et al.
(2024) apply causal mediation analysis across more than forty in-context learning tasks
and four model families, and find that a small number of attention heads — approximately
ten in GPT-J, scaled roughly proportionally in larger models — transport a compact
representation of the demonstrated task, with strong causal effects in the middle layers.
The critical result is that this representation, which the authors term a function vector,
is sufficient on its own: adding that single direction to a model given no demonstrations
at all raises GPT-J from 5.5 per cent to 57.5 per cent, GPT-NeoX-20B from 6.7 to 57.1 per
cent, and Llama-2-70B from 8.2 to 83.8 per cent. Moreover, Hendel, Geva and Globerson
(2023) reach a concordant conclusion by an independent route, and Yin and Steinhardt
(2025) find that it is precisely these heads, rather than induction heads, that carry most
of the few-shot effect in larger models.

<figure>
<svg class="dg" viewBox="0 0 620 236" role="img" aria-labelledby="ttl-fv">
  <title id="ttl-fv">Extracting a task vector from in-context demonstrations</title>
  <rect class="box" x="20" y="40" width="132" height="66"/>
  <text class="t" x="34" y="62">chalk -&gt; craie</text>
  <text class="t" x="34" y="78">river -&gt; riviere</text>
  <text class="t" x="34" y="94">stone -&gt; pierre</text>
  <text class="tf" x="20" y="28">demonstrations</text>
  <path class="line" d="M 158 73 L 196 73"/>
  <polygon class="arrow" points="202,73 192,69 192,77"/>
  <rect class="fill" x="202" y="40" width="140" height="66"/>
  <text class="t" x="272" y="66" text-anchor="middle">activations at a</text>
  <text class="t" x="272" y="82" text-anchor="middle">small set of heads</text>
  <text class="tf" x="202" y="28">measured, then averaged</text>
  <path class="line" d="M 348 73 L 386 73"/>
  <polygon class="arrow" points="392,73 382,69 382,77"/>
  <rect class="hot" x="392" y="52" width="96" height="42"/>
  <text class="tr" x="440" y="77" text-anchor="middle">task vector</text>
  <path class="line" d="M 440 100 L 440 150"/>
  <polygon class="arrow" points="440,156 436,146 444,146"/>
  <text class="tm" x="452" y="130">added at one layer</text>
  <rect class="box" x="202" y="156" width="140" height="46"/>
  <text class="t" x="272" y="176" text-anchor="middle">zero-shot prompt,</text>
  <text class="t" x="272" y="192" text-anchor="middle">no demonstrations</text>
  <path class="line" d="M 348 179 L 386 179"/>
  <polygon class="arrow" points="392,179 382,175 382,183"/>
  <rect class="fill" x="392" y="158" width="96" height="42"/>
  <text class="t" x="440" y="183" text-anchor="middle">task performed</text>
</svg>
<figcaption><span class="label">Figure 2</span> The extraction and transplantation
procedure. Activations at a small set of mid-layer attention heads are averaged over many
sets of demonstrations to yield a single additive direction, which is then inserted into a
forward pass on a prompt containing no demonstrations at all. The figure depicts the
experimental procedure, not an operation a practitioner can perform through a prompt; its
relevance to prompting is that it establishes what the demonstrations are carrying.
Drawn from the method described in Todd et al. (2024).</figcaption>
</figure>

The portability of that encoding is the property with the clearest consequence for
prompting. Todd et al. (2024) collect a function vector from demonstrations in one
format and insert it into natural-text passages sharing no format with those
demonstrations, recovering accuracies of 55.2, 67.7 and 46.0 per cent against near-zero
baselines, which the authors describe as on a par with their zero-shot results.
Therefore, what the demonstrations install is not tied to the
surface shape of the demonstrations themselves, and it survives into later and differently
formatted regions of the context (Todd et al., 2024).

<div class="tenet">
<p class="label">What the evidence supports</p>
<p>That a few consistent demonstrations of a concrete, well-specified transformation
install a compact task representation, carried by a small set of mid-layer heads, which
persists into later and differently formatted parts of the context.</p>
<p class="label" style="margin-top:14px">What it does not</p>
<p>That the representation carries high-level behavioural disposition, that more
demonstrations are monotonically better, or that this has been shown at agent scale on a
long-horizon coding task.</p>
</div>

Two limitations bound how far that result can be carried. Firstly, the headline figure is
computed on a set of queries filtered to those the model already answers correctly when
given ten demonstrations, which means the function vector recovers roughly fifty-seven per
cent of ten-shot performance rather than approximating in-context learning as such;
Todd et al. (2024) further note that function vectors do not act purely linearly but
trigger nonlinear computation in later layers. Secondly, Brumley et al. (2024) find that
function vectors perform well on precise, fine-grained mappings but struggle with
high-level concepts such as sentiment transfer and detoxification. It can then be said
that the mechanism is well evidenced for concrete transformations and poorly evidenced —
indeed, evidenced against — for abstract behavioural instruction.

## What this licenses in an agentic coding prompt

The recommendations that follow are extrapolations, because every study cited above used base models on short, word-level
tasks or on synthetic sequences, none larger than seventy billion parameters, and none used
a tool-using agent on a repository (Olsson et al., 2022; Todd et al., 2024). They are
offered as hypotheses to be tested against a practitioner's own evaluation set rather than
as engineering constraints.

Firstly, demonstrations should exhibit a concrete transformation rather than describe a
disposition, because that is the regime in which the function vector evidence is strong
and the regime in which Brumley et al. (2024) find it degrades is precisely the abstract
one. A demonstration of the exact shape of a commit message, a specific refactor applied to one
function, or an exact test-naming convention is well founded; a demonstration intended to
convey care, seniority or thoroughness is not (Brumley et al., 2024).

```text
Rewrite the given test to the table-driven form.

  before:
    func TestParseTimeout(t *testing.T) {
        got, err := ParseTimeout("30s")
        if err != nil { t.Fatalf("ParseTimeout: %v", err) }
        if got != 30*time.Second { t.Errorf("got %v, want 30s", got) }
    }

  after:
    func TestParseTimeout(t *testing.T) {
        cases := []struct{
            name string
            in   string
            want time.Duration
            wantErr bool
        }{
            {name: "seconds", in: "30s", want: 30 * time.Second},
        }
        for _, c := range cases {
            t.Run(c.name, func(t *testing.T) { ... })
        }
    }

Apply the same transformation to TestParseRetries in internal/config/parse_test.go.
```

Secondly, demonstrations should be internally consistent in surface form, because the
induction mechanism is defined over literal token matches, and paraphrase is therefore not
guaranteed to engage it (Olsson et al., 2022). Where two examples show the same transformation with different import
styles, different receiver names or different error-wrapping idioms, the surface
regularity the copying mechanism could exploit has been removed at no benefit to the task
encoding. In short, the examples should vary in the input and be rigid in the form.

Thirdly, a small number of clean demonstrations is preferable to a large number of noisy
ones, because the function vector is computed by Todd et al. (2024) as an average over
demonstration sets, and an average is degraded by inconsistent members. It must be noted
that no cited study establishes an optimal count, and that the claim here is only the
comparative one.

Lastly, high-level behavioural instruction should be written as explicit constraint rather
than demonstrated by example, since it falls outside what the evidence supports.

```text
Constraints, which apply to every edit in this task:
  - Do not add a dependency that is not already in go.mod.
  - Every exported function you add carries a doc comment beginning with its name.
  - If a test fails twice for the same reason, stop and report rather than retrying.
```

## Conclusion

It was first established that induction heads are a replicated mechanism, defined by
prefix matching and copying rather than by any task, whose formation coincides with a
training phase change and whose ablation reduces in-context learning in small models.
Next, it was argued that the further inference to in-context learning in general is the
original authors' hypothesis rather than their result, and that Yin and Steinhardt (2025)
have since contested it directly. It was then shown that function vectors provide a
better-evidenced account of what demonstrations install, namely a compact task encoding
carried by roughly ten mid-layer heads that transfers into contexts sharing none of the
demonstrations' format. Finally, four prompting recommendations were derived and
explicitly marked as extrapolations, together with the abstract case the evidence argues
against. A common thread running through these findings is that the mechanisms are
specific and the explanations built on them are not, and that the practitioner's leverage
lies in the specific half. As a next step, each recommendation above should be treated as
a hypothesis to be tested on a practitioner's own task, because the gap between a
seventy-billion-parameter base model performing antonym mapping and an agent editing a
repository over many turns is not one the cited literature bridges.

[The second note in this series](/blog/position-retrieval-heads-and-context-ordering/) takes up where information should sit in a long
context, and the sparse set of heads that copies it out.

## References

<ol class="refs">
<li>Bietti, A., Cabannes, V., Bouchacourt, D., Jegou, H., &amp; Bottou, L. (2023). Birth of a transformer: a memory viewpoint. <em>Advances in Neural Information Processing Systems 36</em>.</li>
<li>Brumley, M., Kwon, J., Krueger, D., Krasheninnikov, D., &amp; Anwar, U. (2024). Comparing bottom-up and top-down steering approaches on in-context learning tasks. <a href="https://arxiv.org/abs/2411.07213">arXiv:2411.07213</a>.</li>
<li>Crosbie, J., &amp; Shutova, E. (2025). Induction heads as an essential mechanism for pattern matching in in-context learning. <a href="https://aclanthology.org/2025.findings-naacl.283/"><em>Findings of NAACL 2025</em></a>.</li>
<li>Hendel, R., Geva, M., &amp; Globerson, A. (2023). In-context learning creates task vectors. <em>Findings of EMNLP 2023</em>.</li>
<li>Olsson, C., Elhage, N., Nanda, N., Joseph, N., DasSarma, N., Henighan, T., et al. (2022). In-context learning and induction heads. <em>Transformer Circuits Thread</em>. <a href="https://arxiv.org/abs/2209.11895">arXiv:2209.11895</a>.</li>
<li>Reddy, G. (2024). The mechanistic basis of data dependence and abrupt learning in an in-context classification task. <em>International Conference on Learning Representations</em>.</li>
<li>Todd, E., Li, M. L., Sen Sharma, A., Mueller, A., Wallace, B. C., &amp; Bau, D. (2024). Function vectors in large language models. <em>International Conference on Learning Representations</em>. <a href="https://arxiv.org/abs/2310.15213">arXiv:2310.15213</a>.</li>
<li>Yin, K., &amp; Steinhardt, J. (2025). Which attention heads matter for in-context learning? <em>International Conference on Machine Learning</em>. <a href="https://arxiv.org/abs/2502.14010">arXiv:2502.14010</a>.</li>
</ol>
