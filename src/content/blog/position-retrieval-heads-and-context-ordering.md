---
title: "Agentic Coding x Mechanistic Interpretability pt. 2: Ordering the Context"
description: "A budget for the context window, what to cut first, which identifiers to supply verbatim, and a mechanical check for the fabricated paths a long context reliably produces."
pubDate: 2026-08-29
tags: ["mechanistic interpretability", "prompting", "agents"]
---

The following discussion maintains that the position of information within a long context
is a design decision rather than a matter of convenience, and that the mechanism carrying
information out of a context into an output is narrow enough, and fails badly enough, to
justify specific changes in how an agentic coding prompt is assembled. It will be shown
that position materially changes whether a model uses information, under an experimental
design that holds the content constant. Next, it will be argued that this is not remedied
by using a model trained or marketed for long contexts, and that the effect persists in
current models under harder evaluations. It will then be argued that the copying of
context into output is carried by a sparse and universal set of retrieval heads whose
removal is causally established to produce hallucination rather than abstention. Lastly, a budget for the context window will be set out,
together with the order in which material should be cut, the identifiers that must be
supplied verbatim, the practice of re-anchoring an instruction at the end of a long turn,
and a mechanical check for the fabricated identifiers this mechanism produces when it
fails. It should be noted that the
positional finding is behavioural rather than mechanistic, that the attention-level
account of it comes from a different paper than the accuracy-level one, and that the two
are cited separately below for that reason.

## Position changes whether information is used

The position at which relevant information sits in a long context materially changes
whether a model retrieves it, and the finding is credible because the experimental design
holds everything else fixed. Liu et al. (2024) construct two tasks — multi-document
question answering and a synthetic key-value retrieval task — in which the content of the
context is held constant and only the position of the relevant document is permuted,
which removes the obvious confound that harder questions might be placed further in. They
report that "performance is often highest when relevant information occurs at the
beginning or end of the input context, and significantly degrades when models must access
relevant information in the middle of long contexts". Because content is fixed and only order
varies, the degradation is attributable to position itself (Liu et al., 2024).

<figure>
<svg class="dg" viewBox="0 0 620 300" role="img" aria-labelledby="ttl-u">
  <title id="ttl-u">Retrieval accuracy against the position of the relevant document</title>
  <rect class="band" x="200" y="46" width="220" height="176"/>
  <text class="tf" x="310" y="40" text-anchor="middle">middle of the context</text>
  <line class="rule" x1="60" y1="222" x2="580" y2="222"/>
  <line class="rule" x1="60" y1="46"  x2="60"  y2="222"/>
  <path class="plot" d="M 60.0 103.4 L 86.3 107.5 L 112.6 116.4 L 138.9 127.9 L 165.3 140.6 L 191.6 153.4 L 217.9 165.0 L 244.2 174.4 L 270.5 180.9 L 296.8 183.9 L 323.2 183.1 L 349.5 178.5 L 375.8 170.3 L 402.1 159.2 L 428.4 146.0 L 454.7 131.6 L 481.1 117.2 L 507.4 104.1 L 533.7 93.5 L 560.0 87.8"/>
  <circle class="hot" cx="60.0" cy="103.4" r="2.4"/>
  <circle class="hot" cx="86.3" cy="107.5" r="2.4"/>
  <circle class="hot" cx="112.6" cy="116.4" r="2.4"/>
  <circle class="hot" cx="138.9" cy="127.9" r="2.4"/>
  <circle class="hot" cx="165.3" cy="140.6" r="2.4"/>
  <circle class="hot" cx="191.6" cy="153.4" r="2.4"/>
  <circle class="hot" cx="217.9" cy="165.0" r="2.4"/>
  <circle class="hot" cx="244.2" cy="174.4" r="2.4"/>
  <circle class="hot" cx="270.5" cy="180.9" r="2.4"/>
  <circle class="hot" cx="296.8" cy="183.9" r="2.4"/>
  <circle class="hot" cx="323.2" cy="183.1" r="2.4"/>
  <circle class="hot" cx="349.5" cy="178.5" r="2.4"/>
  <circle class="hot" cx="375.8" cy="170.3" r="2.4"/>
  <circle class="hot" cx="402.1" cy="159.2" r="2.4"/>
  <circle class="hot" cx="428.4" cy="146.0" r="2.4"/>
  <circle class="hot" cx="454.7" cy="131.6" r="2.4"/>
  <circle class="hot" cx="481.1" cy="117.2" r="2.4"/>
  <circle class="hot" cx="507.4" cy="104.1" r="2.4"/>
  <circle class="hot" cx="533.7" cy="93.5" r="2.4"/>
  <circle class="hot" cx="560.0" cy="87.8" r="2.4"/>
  <text class="tf" x="52" y="60"  text-anchor="end">high</text>
  <text class="tf" x="52" y="218" text-anchor="end">low</text>
  <text class="tf" x="24" y="140" text-anchor="middle" transform="rotate(-90 24 140)">accuracy</text>
  <text class="tf" x="60"  y="242">first</text>
  <text class="tf" x="580" y="242" text-anchor="end">last</text>
  <text class="tf" x="320" y="266" text-anchor="middle">position of the relevant document in the context</text>
</svg><figcaption><span class="label">Figure 1</span> The shape reported by Liu et al. (2024):
accuracy is highest when the relevant document sits at the beginning or the end of the
context and lowest when it sits in the middle. The curve is drawn to show the shape of the
result rather than to reproduce any single model's measurements, and the shape is not
universal — effect sizes in the source range from roughly four points to more than twenty,
and some models show recency without primacy.</figcaption>
</figure>

Two independent lines of work strengthen the result rather than merely repeating it.
Hsieh, Chuang et al. (2024) examine the attention distribution directly and find that models
"exhibit a U-shaped attention bias where the tokens at the beginning and at the end of its
input receive higher attention, regardless of their relevance", which supplies a
mechanism-level correlate of the behavioural finding; it must be noted that this
attention-level claim belongs to Hsieh, Chuang et al. and not to Liu et al., who measured accuracy
only. Furthermore, Salvatore, Wang and Zhang (2025) reproduce primacy, recency and the resulting
shape in models trained from scratch on synthetic retrieval data, which answers the
objection that the effect might be an artefact of the pretraining corpus rather than of the
architecture and training procedure.

It must be noted that the effect is less uniform than its popular summary suggests.
Recency is the robust half of the finding, whereas primacy is scale- and
model-dependent — Liu et al. (2024) report Llama-2-7B as recency-only and Claude-1.3 as
close to flat on synthetic key-value retrieval — and a distinct U-shape is therefore not
observed consistently across models. Accordingly, the defensible statement is that position
materially affects retrievability and that the shape of the effect varies by model, rather
than the stronger and more quotable claim that a U-curve always obtains (Liu et al., 2024;
Hsieh, Chuang et al., 2024).

## A longer context window does not remedy it

Adopting a model trained or marketed for long contexts does not remove the positional
effect, which is the finding with the most direct bearing on how practitioners provision
context. Liu et al. (2024) compare models against their own extended-context variants and
find the positional profiles essentially superimposed: GPT-3.5-Turbo scores 75.8, 57.2,
53.8, 55.4 and 63.2 across the five positions, while GPT-3.5-Turbo-16K scores 75.7, 57.3,
54.1, 55.4 and 63.1, and the Claude-1.3 comparison behaves likewise. Consequently, the extended
window changes what can be supplied, not what can be used (Liu et al., 2024).

<aside class="note"><p>This is the point at which a great deal of agent design goes wrong.
Provisioning a larger window is procurement; deciding what occupies it is engineering. The
evidence bears on the second and is silent on the first.</p></aside>

The persistence of the effect in more recent models has been established under harder
evaluations than the original. The RULER benchmark of Hsieh, Sun et al. (2024), which evaluates
seventeen models on tasks harder than simple retrieval, finds that only half of them maintain satisfactory performance
at a context length of thirty-two thousand tokens, despite claiming far longer windows. Moreover, Modarressi et
al. (2025) report that eleven of thirteen models claiming at least a hundred and
twenty-eight thousand tokens fall below half of their short-context baseline at
thirty-two thousand tokens, with GPT-4o declining from 99.3 to 69.7 per cent. It should be
noted that Modarressi et al. attribute a substantial part of this degradation to the
absence of literal lexical overlap between the query and the target rather than to
position as such, which is a distinct mechanism and is taken up in the next section.

## The heads that copy context into output

The copying of information out of a long context is carried by a sparse and identifiable
set of attention heads whose causal role has been established by ablation with a matched
control. Wu et al. (2025) identify what they term retrieval heads by a copy-paste
frequency criterion and report that these heads are universal, in that every long-context
model examined possesses such a set; sparse, at roughly three to six per cent of all
heads; and causal, in that "completely pruning retrieval heads leads to failure in
retrieving relevant information and results in hallucination, while pruning random
non-retrieval heads does not affect the model's retrieval ability".

<figure class="scroll">
<svg class="dg" viewBox="0 0 620 552" role="img" aria-labelledby="ttl-rh">
  <title id="ttl-rh">Retrieval heads as a fraction of all attention heads</title>
  <text class="tf" x="20" y="26">Every attention head in a 32-layer model</text>
  <rect class="fill" x="60" y="44" width="11" height="11"/>
  <rect class="fill" x="73" y="44" width="11" height="11"/>
  <rect class="fill" x="86" y="44" width="11" height="11"/>
  <rect class="fill" x="99" y="44" width="11" height="11"/>
  <rect class="fill" x="112" y="44" width="11" height="11"/>
  <rect class="fill" x="125" y="44" width="11" height="11"/>
  <rect class="fill" x="138" y="44" width="11" height="11"/>
  <rect class="fill" x="151" y="44" width="11" height="11"/>
  <rect class="fill" x="164" y="44" width="11" height="11"/>
  <rect class="hot" x="177" y="44" width="11" height="11"/>
  <rect class="fill" x="190" y="44" width="11" height="11"/>
  <rect class="fill" x="203" y="44" width="11" height="11"/>
  <rect class="fill" x="216" y="44" width="11" height="11"/>
  <rect class="fill" x="229" y="44" width="11" height="11"/>
  <rect class="fill" x="242" y="44" width="11" height="11"/>
  <rect class="fill" x="255" y="44" width="11" height="11"/>
  <rect class="fill" x="268" y="44" width="11" height="11"/>
  <rect class="fill" x="281" y="44" width="11" height="11"/>
  <rect class="fill" x="294" y="44" width="11" height="11"/>
  <rect class="fill" x="307" y="44" width="11" height="11"/>
  <rect class="fill" x="320" y="44" width="11" height="11"/>
  <rect class="fill" x="333" y="44" width="11" height="11"/>
  <rect class="fill" x="346" y="44" width="11" height="11"/>
  <rect class="fill" x="359" y="44" width="11" height="11"/>
  <rect class="fill" x="372" y="44" width="11" height="11"/>
  <rect class="fill" x="385" y="44" width="11" height="11"/>
  <rect class="fill" x="398" y="44" width="11" height="11"/>
  <rect class="fill" x="411" y="44" width="11" height="11"/>
  <rect class="fill" x="424" y="44" width="11" height="11"/>
  <rect class="fill" x="437" y="44" width="11" height="11"/>
  <rect class="hot" x="450" y="44" width="11" height="11"/>
  <rect class="fill" x="463" y="44" width="11" height="11"/>
  <rect class="fill" x="60" y="57" width="11" height="11"/>
  <rect class="fill" x="73" y="57" width="11" height="11"/>
  <rect class="fill" x="86" y="57" width="11" height="11"/>
  <rect class="fill" x="99" y="57" width="11" height="11"/>
  <rect class="fill" x="112" y="57" width="11" height="11"/>
  <rect class="fill" x="125" y="57" width="11" height="11"/>
  <rect class="fill" x="138" y="57" width="11" height="11"/>
  <rect class="fill" x="151" y="57" width="11" height="11"/>
  <rect class="fill" x="164" y="57" width="11" height="11"/>
  <rect class="fill" x="177" y="57" width="11" height="11"/>
  <rect class="fill" x="190" y="57" width="11" height="11"/>
  <rect class="fill" x="203" y="57" width="11" height="11"/>
  <rect class="fill" x="216" y="57" width="11" height="11"/>
  <rect class="fill" x="229" y="57" width="11" height="11"/>
  <rect class="fill" x="242" y="57" width="11" height="11"/>
  <rect class="fill" x="255" y="57" width="11" height="11"/>
  <rect class="fill" x="268" y="57" width="11" height="11"/>
  <rect class="fill" x="281" y="57" width="11" height="11"/>
  <rect class="fill" x="294" y="57" width="11" height="11"/>
  <rect class="fill" x="307" y="57" width="11" height="11"/>
  <rect class="fill" x="320" y="57" width="11" height="11"/>
  <rect class="fill" x="333" y="57" width="11" height="11"/>
  <rect class="fill" x="346" y="57" width="11" height="11"/>
  <rect class="fill" x="359" y="57" width="11" height="11"/>
  <rect class="fill" x="372" y="57" width="11" height="11"/>
  <rect class="fill" x="385" y="57" width="11" height="11"/>
  <rect class="fill" x="398" y="57" width="11" height="11"/>
  <rect class="fill" x="411" y="57" width="11" height="11"/>
  <rect class="hot" x="424" y="57" width="11" height="11"/>
  <rect class="hot" x="437" y="57" width="11" height="11"/>
  <rect class="fill" x="450" y="57" width="11" height="11"/>
  <rect class="fill" x="463" y="57" width="11" height="11"/>
  <rect class="fill" x="60" y="70" width="11" height="11"/>
  <rect class="fill" x="73" y="70" width="11" height="11"/>
  <rect class="fill" x="86" y="70" width="11" height="11"/>
  <rect class="fill" x="99" y="70" width="11" height="11"/>
  <rect class="fill" x="112" y="70" width="11" height="11"/>
  <rect class="fill" x="125" y="70" width="11" height="11"/>
  <rect class="fill" x="138" y="70" width="11" height="11"/>
  <rect class="fill" x="151" y="70" width="11" height="11"/>
  <rect class="fill" x="164" y="70" width="11" height="11"/>
  <rect class="hot" x="177" y="70" width="11" height="11"/>
  <rect class="fill" x="190" y="70" width="11" height="11"/>
  <rect class="fill" x="203" y="70" width="11" height="11"/>
  <rect class="fill" x="216" y="70" width="11" height="11"/>
  <rect class="fill" x="229" y="70" width="11" height="11"/>
  <rect class="fill" x="242" y="70" width="11" height="11"/>
  <rect class="fill" x="255" y="70" width="11" height="11"/>
  <rect class="fill" x="268" y="70" width="11" height="11"/>
  <rect class="fill" x="281" y="70" width="11" height="11"/>
  <rect class="fill" x="294" y="70" width="11" height="11"/>
  <rect class="fill" x="307" y="70" width="11" height="11"/>
  <rect class="fill" x="320" y="70" width="11" height="11"/>
  <rect class="hot" x="333" y="70" width="11" height="11"/>
  <rect class="fill" x="346" y="70" width="11" height="11"/>
  <rect class="fill" x="359" y="70" width="11" height="11"/>
  <rect class="fill" x="372" y="70" width="11" height="11"/>
  <rect class="fill" x="385" y="70" width="11" height="11"/>
  <rect class="fill" x="398" y="70" width="11" height="11"/>
  <rect class="fill" x="411" y="70" width="11" height="11"/>
  <rect class="fill" x="424" y="70" width="11" height="11"/>
  <rect class="fill" x="437" y="70" width="11" height="11"/>
  <rect class="fill" x="450" y="70" width="11" height="11"/>
  <rect class="fill" x="463" y="70" width="11" height="11"/>
  <rect class="fill" x="60" y="83" width="11" height="11"/>
  <rect class="fill" x="73" y="83" width="11" height="11"/>
  <rect class="fill" x="86" y="83" width="11" height="11"/>
  <rect class="fill" x="99" y="83" width="11" height="11"/>
  <rect class="fill" x="112" y="83" width="11" height="11"/>
  <rect class="fill" x="125" y="83" width="11" height="11"/>
  <rect class="fill" x="138" y="83" width="11" height="11"/>
  <rect class="fill" x="151" y="83" width="11" height="11"/>
  <rect class="fill" x="164" y="83" width="11" height="11"/>
  <rect class="fill" x="177" y="83" width="11" height="11"/>
  <rect class="fill" x="190" y="83" width="11" height="11"/>
  <rect class="fill" x="203" y="83" width="11" height="11"/>
  <rect class="fill" x="216" y="83" width="11" height="11"/>
  <rect class="fill" x="229" y="83" width="11" height="11"/>
  <rect class="fill" x="242" y="83" width="11" height="11"/>
  <rect class="fill" x="255" y="83" width="11" height="11"/>
  <rect class="fill" x="268" y="83" width="11" height="11"/>
  <rect class="fill" x="281" y="83" width="11" height="11"/>
  <rect class="fill" x="294" y="83" width="11" height="11"/>
  <rect class="fill" x="307" y="83" width="11" height="11"/>
  <rect class="fill" x="320" y="83" width="11" height="11"/>
  <rect class="fill" x="333" y="83" width="11" height="11"/>
  <rect class="fill" x="346" y="83" width="11" height="11"/>
  <rect class="fill" x="359" y="83" width="11" height="11"/>
  <rect class="fill" x="372" y="83" width="11" height="11"/>
  <rect class="hot" x="385" y="83" width="11" height="11"/>
  <rect class="fill" x="398" y="83" width="11" height="11"/>
  <rect class="fill" x="411" y="83" width="11" height="11"/>
  <rect class="fill" x="424" y="83" width="11" height="11"/>
  <rect class="fill" x="437" y="83" width="11" height="11"/>
  <rect class="fill" x="450" y="83" width="11" height="11"/>
  <rect class="fill" x="463" y="83" width="11" height="11"/>
  <rect class="fill" x="60" y="96" width="11" height="11"/>
  <rect class="hot" x="73" y="96" width="11" height="11"/>
  <rect class="fill" x="86" y="96" width="11" height="11"/>
  <rect class="fill" x="99" y="96" width="11" height="11"/>
  <rect class="fill" x="112" y="96" width="11" height="11"/>
  <rect class="fill" x="125" y="96" width="11" height="11"/>
  <rect class="fill" x="138" y="96" width="11" height="11"/>
  <rect class="fill" x="151" y="96" width="11" height="11"/>
  <rect class="fill" x="164" y="96" width="11" height="11"/>
  <rect class="fill" x="177" y="96" width="11" height="11"/>
  <rect class="fill" x="190" y="96" width="11" height="11"/>
  <rect class="fill" x="203" y="96" width="11" height="11"/>
  <rect class="fill" x="216" y="96" width="11" height="11"/>
  <rect class="fill" x="229" y="96" width="11" height="11"/>
  <rect class="fill" x="242" y="96" width="11" height="11"/>
  <rect class="fill" x="255" y="96" width="11" height="11"/>
  <rect class="fill" x="268" y="96" width="11" height="11"/>
  <rect class="fill" x="281" y="96" width="11" height="11"/>
  <rect class="fill" x="294" y="96" width="11" height="11"/>
  <rect class="fill" x="307" y="96" width="11" height="11"/>
  <rect class="fill" x="320" y="96" width="11" height="11"/>
  <rect class="fill" x="333" y="96" width="11" height="11"/>
  <rect class="fill" x="346" y="96" width="11" height="11"/>
  <rect class="fill" x="359" y="96" width="11" height="11"/>
  <rect class="fill" x="372" y="96" width="11" height="11"/>
  <rect class="fill" x="385" y="96" width="11" height="11"/>
  <rect class="fill" x="398" y="96" width="11" height="11"/>
  <rect class="fill" x="411" y="96" width="11" height="11"/>
  <rect class="fill" x="424" y="96" width="11" height="11"/>
  <rect class="fill" x="437" y="96" width="11" height="11"/>
  <rect class="fill" x="450" y="96" width="11" height="11"/>
  <rect class="fill" x="463" y="96" width="11" height="11"/>
  <rect class="fill" x="60" y="109" width="11" height="11"/>
  <rect class="fill" x="73" y="109" width="11" height="11"/>
  <rect class="fill" x="86" y="109" width="11" height="11"/>
  <rect class="fill" x="99" y="109" width="11" height="11"/>
  <rect class="fill" x="112" y="109" width="11" height="11"/>
  <rect class="fill" x="125" y="109" width="11" height="11"/>
  <rect class="fill" x="138" y="109" width="11" height="11"/>
  <rect class="fill" x="151" y="109" width="11" height="11"/>
  <rect class="fill" x="164" y="109" width="11" height="11"/>
  <rect class="fill" x="177" y="109" width="11" height="11"/>
  <rect class="hot" x="190" y="109" width="11" height="11"/>
  <rect class="fill" x="203" y="109" width="11" height="11"/>
  <rect class="fill" x="216" y="109" width="11" height="11"/>
  <rect class="fill" x="229" y="109" width="11" height="11"/>
  <rect class="hot" x="242" y="109" width="11" height="11"/>
  <rect class="fill" x="255" y="109" width="11" height="11"/>
  <rect class="fill" x="268" y="109" width="11" height="11"/>
  <rect class="fill" x="281" y="109" width="11" height="11"/>
  <rect class="fill" x="294" y="109" width="11" height="11"/>
  <rect class="fill" x="307" y="109" width="11" height="11"/>
  <rect class="fill" x="320" y="109" width="11" height="11"/>
  <rect class="fill" x="333" y="109" width="11" height="11"/>
  <rect class="fill" x="346" y="109" width="11" height="11"/>
  <rect class="fill" x="359" y="109" width="11" height="11"/>
  <rect class="fill" x="372" y="109" width="11" height="11"/>
  <rect class="hot" x="385" y="109" width="11" height="11"/>
  <rect class="fill" x="398" y="109" width="11" height="11"/>
  <rect class="fill" x="411" y="109" width="11" height="11"/>
  <rect class="fill" x="424" y="109" width="11" height="11"/>
  <rect class="fill" x="437" y="109" width="11" height="11"/>
  <rect class="fill" x="450" y="109" width="11" height="11"/>
  <rect class="fill" x="463" y="109" width="11" height="11"/>
  <rect class="hot" x="60" y="122" width="11" height="11"/>
  <rect class="fill" x="73" y="122" width="11" height="11"/>
  <rect class="fill" x="86" y="122" width="11" height="11"/>
  <rect class="fill" x="99" y="122" width="11" height="11"/>
  <rect class="fill" x="112" y="122" width="11" height="11"/>
  <rect class="fill" x="125" y="122" width="11" height="11"/>
  <rect class="fill" x="138" y="122" width="11" height="11"/>
  <rect class="fill" x="151" y="122" width="11" height="11"/>
  <rect class="fill" x="164" y="122" width="11" height="11"/>
  <rect class="fill" x="177" y="122" width="11" height="11"/>
  <rect class="fill" x="190" y="122" width="11" height="11"/>
  <rect class="fill" x="203" y="122" width="11" height="11"/>
  <rect class="fill" x="216" y="122" width="11" height="11"/>
  <rect class="fill" x="229" y="122" width="11" height="11"/>
  <rect class="fill" x="242" y="122" width="11" height="11"/>
  <rect class="fill" x="255" y="122" width="11" height="11"/>
  <rect class="fill" x="268" y="122" width="11" height="11"/>
  <rect class="fill" x="281" y="122" width="11" height="11"/>
  <rect class="fill" x="294" y="122" width="11" height="11"/>
  <rect class="fill" x="307" y="122" width="11" height="11"/>
  <rect class="fill" x="320" y="122" width="11" height="11"/>
  <rect class="fill" x="333" y="122" width="11" height="11"/>
  <rect class="fill" x="346" y="122" width="11" height="11"/>
  <rect class="fill" x="359" y="122" width="11" height="11"/>
  <rect class="fill" x="372" y="122" width="11" height="11"/>
  <rect class="fill" x="385" y="122" width="11" height="11"/>
  <rect class="fill" x="398" y="122" width="11" height="11"/>
  <rect class="fill" x="411" y="122" width="11" height="11"/>
  <rect class="fill" x="424" y="122" width="11" height="11"/>
  <rect class="fill" x="437" y="122" width="11" height="11"/>
  <rect class="fill" x="450" y="122" width="11" height="11"/>
  <rect class="fill" x="463" y="122" width="11" height="11"/>
  <rect class="fill" x="60" y="135" width="11" height="11"/>
  <rect class="fill" x="73" y="135" width="11" height="11"/>
  <rect class="fill" x="86" y="135" width="11" height="11"/>
  <rect class="fill" x="99" y="135" width="11" height="11"/>
  <rect class="fill" x="112" y="135" width="11" height="11"/>
  <rect class="fill" x="125" y="135" width="11" height="11"/>
  <rect class="fill" x="138" y="135" width="11" height="11"/>
  <rect class="fill" x="151" y="135" width="11" height="11"/>
  <rect class="fill" x="164" y="135" width="11" height="11"/>
  <rect class="fill" x="177" y="135" width="11" height="11"/>
  <rect class="fill" x="190" y="135" width="11" height="11"/>
  <rect class="fill" x="203" y="135" width="11" height="11"/>
  <rect class="fill" x="216" y="135" width="11" height="11"/>
  <rect class="fill" x="229" y="135" width="11" height="11"/>
  <rect class="fill" x="242" y="135" width="11" height="11"/>
  <rect class="fill" x="255" y="135" width="11" height="11"/>
  <rect class="fill" x="268" y="135" width="11" height="11"/>
  <rect class="fill" x="281" y="135" width="11" height="11"/>
  <rect class="fill" x="294" y="135" width="11" height="11"/>
  <rect class="fill" x="307" y="135" width="11" height="11"/>
  <rect class="fill" x="320" y="135" width="11" height="11"/>
  <rect class="fill" x="333" y="135" width="11" height="11"/>
  <rect class="fill" x="346" y="135" width="11" height="11"/>
  <rect class="fill" x="359" y="135" width="11" height="11"/>
  <rect class="fill" x="372" y="135" width="11" height="11"/>
  <rect class="fill" x="385" y="135" width="11" height="11"/>
  <rect class="fill" x="398" y="135" width="11" height="11"/>
  <rect class="fill" x="411" y="135" width="11" height="11"/>
  <rect class="fill" x="424" y="135" width="11" height="11"/>
  <rect class="fill" x="437" y="135" width="11" height="11"/>
  <rect class="fill" x="450" y="135" width="11" height="11"/>
  <rect class="fill" x="463" y="135" width="11" height="11"/>
  <rect class="fill" x="60" y="148" width="11" height="11"/>
  <rect class="fill" x="73" y="148" width="11" height="11"/>
  <rect class="fill" x="86" y="148" width="11" height="11"/>
  <rect class="fill" x="99" y="148" width="11" height="11"/>
  <rect class="fill" x="112" y="148" width="11" height="11"/>
  <rect class="fill" x="125" y="148" width="11" height="11"/>
  <rect class="fill" x="138" y="148" width="11" height="11"/>
  <rect class="fill" x="151" y="148" width="11" height="11"/>
  <rect class="fill" x="164" y="148" width="11" height="11"/>
  <rect class="fill" x="177" y="148" width="11" height="11"/>
  <rect class="fill" x="190" y="148" width="11" height="11"/>
  <rect class="fill" x="203" y="148" width="11" height="11"/>
  <rect class="fill" x="216" y="148" width="11" height="11"/>
  <rect class="fill" x="229" y="148" width="11" height="11"/>
  <rect class="fill" x="242" y="148" width="11" height="11"/>
  <rect class="fill" x="255" y="148" width="11" height="11"/>
  <rect class="fill" x="268" y="148" width="11" height="11"/>
  <rect class="fill" x="281" y="148" width="11" height="11"/>
  <rect class="fill" x="294" y="148" width="11" height="11"/>
  <rect class="fill" x="307" y="148" width="11" height="11"/>
  <rect class="fill" x="320" y="148" width="11" height="11"/>
  <rect class="fill" x="333" y="148" width="11" height="11"/>
  <rect class="fill" x="346" y="148" width="11" height="11"/>
  <rect class="fill" x="359" y="148" width="11" height="11"/>
  <rect class="fill" x="372" y="148" width="11" height="11"/>
  <rect class="fill" x="385" y="148" width="11" height="11"/>
  <rect class="fill" x="398" y="148" width="11" height="11"/>
  <rect class="fill" x="411" y="148" width="11" height="11"/>
  <rect class="fill" x="424" y="148" width="11" height="11"/>
  <rect class="fill" x="437" y="148" width="11" height="11"/>
  <rect class="fill" x="450" y="148" width="11" height="11"/>
  <rect class="fill" x="463" y="148" width="11" height="11"/>
  <rect class="fill" x="60" y="161" width="11" height="11"/>
  <rect class="fill" x="73" y="161" width="11" height="11"/>
  <rect class="hot" x="86" y="161" width="11" height="11"/>
  <rect class="fill" x="99" y="161" width="11" height="11"/>
  <rect class="fill" x="112" y="161" width="11" height="11"/>
  <rect class="fill" x="125" y="161" width="11" height="11"/>
  <rect class="fill" x="138" y="161" width="11" height="11"/>
  <rect class="fill" x="151" y="161" width="11" height="11"/>
  <rect class="fill" x="164" y="161" width="11" height="11"/>
  <rect class="fill" x="177" y="161" width="11" height="11"/>
  <rect class="fill" x="190" y="161" width="11" height="11"/>
  <rect class="fill" x="203" y="161" width="11" height="11"/>
  <rect class="fill" x="216" y="161" width="11" height="11"/>
  <rect class="fill" x="229" y="161" width="11" height="11"/>
  <rect class="fill" x="242" y="161" width="11" height="11"/>
  <rect class="fill" x="255" y="161" width="11" height="11"/>
  <rect class="fill" x="268" y="161" width="11" height="11"/>
  <rect class="fill" x="281" y="161" width="11" height="11"/>
  <rect class="fill" x="294" y="161" width="11" height="11"/>
  <rect class="fill" x="307" y="161" width="11" height="11"/>
  <rect class="fill" x="320" y="161" width="11" height="11"/>
  <rect class="fill" x="333" y="161" width="11" height="11"/>
  <rect class="fill" x="346" y="161" width="11" height="11"/>
  <rect class="fill" x="359" y="161" width="11" height="11"/>
  <rect class="fill" x="372" y="161" width="11" height="11"/>
  <rect class="fill" x="385" y="161" width="11" height="11"/>
  <rect class="fill" x="398" y="161" width="11" height="11"/>
  <rect class="fill" x="411" y="161" width="11" height="11"/>
  <rect class="fill" x="424" y="161" width="11" height="11"/>
  <rect class="fill" x="437" y="161" width="11" height="11"/>
  <rect class="fill" x="450" y="161" width="11" height="11"/>
  <rect class="fill" x="463" y="161" width="11" height="11"/>
  <rect class="fill" x="60" y="174" width="11" height="11"/>
  <rect class="fill" x="73" y="174" width="11" height="11"/>
  <rect class="hot" x="86" y="174" width="11" height="11"/>
  <rect class="fill" x="99" y="174" width="11" height="11"/>
  <rect class="fill" x="112" y="174" width="11" height="11"/>
  <rect class="fill" x="125" y="174" width="11" height="11"/>
  <rect class="fill" x="138" y="174" width="11" height="11"/>
  <rect class="fill" x="151" y="174" width="11" height="11"/>
  <rect class="fill" x="164" y="174" width="11" height="11"/>
  <rect class="fill" x="177" y="174" width="11" height="11"/>
  <rect class="fill" x="190" y="174" width="11" height="11"/>
  <rect class="fill" x="203" y="174" width="11" height="11"/>
  <rect class="fill" x="216" y="174" width="11" height="11"/>
  <rect class="fill" x="229" y="174" width="11" height="11"/>
  <rect class="fill" x="242" y="174" width="11" height="11"/>
  <rect class="fill" x="255" y="174" width="11" height="11"/>
  <rect class="fill" x="268" y="174" width="11" height="11"/>
  <rect class="fill" x="281" y="174" width="11" height="11"/>
  <rect class="fill" x="294" y="174" width="11" height="11"/>
  <rect class="fill" x="307" y="174" width="11" height="11"/>
  <rect class="fill" x="320" y="174" width="11" height="11"/>
  <rect class="fill" x="333" y="174" width="11" height="11"/>
  <rect class="fill" x="346" y="174" width="11" height="11"/>
  <rect class="fill" x="359" y="174" width="11" height="11"/>
  <rect class="fill" x="372" y="174" width="11" height="11"/>
  <rect class="fill" x="385" y="174" width="11" height="11"/>
  <rect class="fill" x="398" y="174" width="11" height="11"/>
  <rect class="fill" x="411" y="174" width="11" height="11"/>
  <rect class="fill" x="424" y="174" width="11" height="11"/>
  <rect class="fill" x="437" y="174" width="11" height="11"/>
  <rect class="fill" x="450" y="174" width="11" height="11"/>
  <rect class="fill" x="463" y="174" width="11" height="11"/>
  <rect class="fill" x="60" y="187" width="11" height="11"/>
  <rect class="fill" x="73" y="187" width="11" height="11"/>
  <rect class="fill" x="86" y="187" width="11" height="11"/>
  <rect class="fill" x="99" y="187" width="11" height="11"/>
  <rect class="fill" x="112" y="187" width="11" height="11"/>
  <rect class="fill" x="125" y="187" width="11" height="11"/>
  <rect class="fill" x="138" y="187" width="11" height="11"/>
  <rect class="fill" x="151" y="187" width="11" height="11"/>
  <rect class="fill" x="164" y="187" width="11" height="11"/>
  <rect class="fill" x="177" y="187" width="11" height="11"/>
  <rect class="fill" x="190" y="187" width="11" height="11"/>
  <rect class="fill" x="203" y="187" width="11" height="11"/>
  <rect class="fill" x="216" y="187" width="11" height="11"/>
  <rect class="fill" x="229" y="187" width="11" height="11"/>
  <rect class="fill" x="242" y="187" width="11" height="11"/>
  <rect class="fill" x="255" y="187" width="11" height="11"/>
  <rect class="fill" x="268" y="187" width="11" height="11"/>
  <rect class="fill" x="281" y="187" width="11" height="11"/>
  <rect class="fill" x="294" y="187" width="11" height="11"/>
  <rect class="fill" x="307" y="187" width="11" height="11"/>
  <rect class="fill" x="320" y="187" width="11" height="11"/>
  <rect class="fill" x="333" y="187" width="11" height="11"/>
  <rect class="fill" x="346" y="187" width="11" height="11"/>
  <rect class="fill" x="359" y="187" width="11" height="11"/>
  <rect class="fill" x="372" y="187" width="11" height="11"/>
  <rect class="fill" x="385" y="187" width="11" height="11"/>
  <rect class="hot" x="398" y="187" width="11" height="11"/>
  <rect class="fill" x="411" y="187" width="11" height="11"/>
  <rect class="fill" x="424" y="187" width="11" height="11"/>
  <rect class="hot" x="437" y="187" width="11" height="11"/>
  <rect class="fill" x="450" y="187" width="11" height="11"/>
  <rect class="fill" x="463" y="187" width="11" height="11"/>
  <rect class="fill" x="60" y="200" width="11" height="11"/>
  <rect class="fill" x="73" y="200" width="11" height="11"/>
  <rect class="fill" x="86" y="200" width="11" height="11"/>
  <rect class="fill" x="99" y="200" width="11" height="11"/>
  <rect class="hot" x="112" y="200" width="11" height="11"/>
  <rect class="hot" x="125" y="200" width="11" height="11"/>
  <rect class="fill" x="138" y="200" width="11" height="11"/>
  <rect class="fill" x="151" y="200" width="11" height="11"/>
  <rect class="fill" x="164" y="200" width="11" height="11"/>
  <rect class="fill" x="177" y="200" width="11" height="11"/>
  <rect class="fill" x="190" y="200" width="11" height="11"/>
  <rect class="fill" x="203" y="200" width="11" height="11"/>
  <rect class="fill" x="216" y="200" width="11" height="11"/>
  <rect class="fill" x="229" y="200" width="11" height="11"/>
  <rect class="fill" x="242" y="200" width="11" height="11"/>
  <rect class="fill" x="255" y="200" width="11" height="11"/>
  <rect class="hot" x="268" y="200" width="11" height="11"/>
  <rect class="fill" x="281" y="200" width="11" height="11"/>
  <rect class="fill" x="294" y="200" width="11" height="11"/>
  <rect class="fill" x="307" y="200" width="11" height="11"/>
  <rect class="fill" x="320" y="200" width="11" height="11"/>
  <rect class="fill" x="333" y="200" width="11" height="11"/>
  <rect class="fill" x="346" y="200" width="11" height="11"/>
  <rect class="fill" x="359" y="200" width="11" height="11"/>
  <rect class="fill" x="372" y="200" width="11" height="11"/>
  <rect class="fill" x="385" y="200" width="11" height="11"/>
  <rect class="fill" x="398" y="200" width="11" height="11"/>
  <rect class="fill" x="411" y="200" width="11" height="11"/>
  <rect class="fill" x="424" y="200" width="11" height="11"/>
  <rect class="fill" x="437" y="200" width="11" height="11"/>
  <rect class="fill" x="450" y="200" width="11" height="11"/>
  <rect class="fill" x="463" y="200" width="11" height="11"/>
  <rect class="fill" x="60" y="213" width="11" height="11"/>
  <rect class="fill" x="73" y="213" width="11" height="11"/>
  <rect class="fill" x="86" y="213" width="11" height="11"/>
  <rect class="fill" x="99" y="213" width="11" height="11"/>
  <rect class="fill" x="112" y="213" width="11" height="11"/>
  <rect class="fill" x="125" y="213" width="11" height="11"/>
  <rect class="fill" x="138" y="213" width="11" height="11"/>
  <rect class="fill" x="151" y="213" width="11" height="11"/>
  <rect class="fill" x="164" y="213" width="11" height="11"/>
  <rect class="fill" x="177" y="213" width="11" height="11"/>
  <rect class="fill" x="190" y="213" width="11" height="11"/>
  <rect class="fill" x="203" y="213" width="11" height="11"/>
  <rect class="fill" x="216" y="213" width="11" height="11"/>
  <rect class="fill" x="229" y="213" width="11" height="11"/>
  <rect class="fill" x="242" y="213" width="11" height="11"/>
  <rect class="fill" x="255" y="213" width="11" height="11"/>
  <rect class="fill" x="268" y="213" width="11" height="11"/>
  <rect class="fill" x="281" y="213" width="11" height="11"/>
  <rect class="fill" x="294" y="213" width="11" height="11"/>
  <rect class="fill" x="307" y="213" width="11" height="11"/>
  <rect class="fill" x="320" y="213" width="11" height="11"/>
  <rect class="fill" x="333" y="213" width="11" height="11"/>
  <rect class="fill" x="346" y="213" width="11" height="11"/>
  <rect class="fill" x="359" y="213" width="11" height="11"/>
  <rect class="fill" x="372" y="213" width="11" height="11"/>
  <rect class="fill" x="385" y="213" width="11" height="11"/>
  <rect class="fill" x="398" y="213" width="11" height="11"/>
  <rect class="fill" x="411" y="213" width="11" height="11"/>
  <rect class="fill" x="424" y="213" width="11" height="11"/>
  <rect class="fill" x="437" y="213" width="11" height="11"/>
  <rect class="fill" x="450" y="213" width="11" height="11"/>
  <rect class="fill" x="463" y="213" width="11" height="11"/>
  <rect class="fill" x="60" y="226" width="11" height="11"/>
  <rect class="fill" x="73" y="226" width="11" height="11"/>
  <rect class="fill" x="86" y="226" width="11" height="11"/>
  <rect class="fill" x="99" y="226" width="11" height="11"/>
  <rect class="fill" x="112" y="226" width="11" height="11"/>
  <rect class="fill" x="125" y="226" width="11" height="11"/>
  <rect class="fill" x="138" y="226" width="11" height="11"/>
  <rect class="fill" x="151" y="226" width="11" height="11"/>
  <rect class="fill" x="164" y="226" width="11" height="11"/>
  <rect class="fill" x="177" y="226" width="11" height="11"/>
  <rect class="fill" x="190" y="226" width="11" height="11"/>
  <rect class="fill" x="203" y="226" width="11" height="11"/>
  <rect class="fill" x="216" y="226" width="11" height="11"/>
  <rect class="fill" x="229" y="226" width="11" height="11"/>
  <rect class="fill" x="242" y="226" width="11" height="11"/>
  <rect class="fill" x="255" y="226" width="11" height="11"/>
  <rect class="fill" x="268" y="226" width="11" height="11"/>
  <rect class="fill" x="281" y="226" width="11" height="11"/>
  <rect class="fill" x="294" y="226" width="11" height="11"/>
  <rect class="fill" x="307" y="226" width="11" height="11"/>
  <rect class="fill" x="320" y="226" width="11" height="11"/>
  <rect class="fill" x="333" y="226" width="11" height="11"/>
  <rect class="hot" x="346" y="226" width="11" height="11"/>
  <rect class="fill" x="359" y="226" width="11" height="11"/>
  <rect class="fill" x="372" y="226" width="11" height="11"/>
  <rect class="fill" x="385" y="226" width="11" height="11"/>
  <rect class="fill" x="398" y="226" width="11" height="11"/>
  <rect class="fill" x="411" y="226" width="11" height="11"/>
  <rect class="fill" x="424" y="226" width="11" height="11"/>
  <rect class="fill" x="437" y="226" width="11" height="11"/>
  <rect class="hot" x="450" y="226" width="11" height="11"/>
  <rect class="fill" x="463" y="226" width="11" height="11"/>
  <rect class="fill" x="60" y="239" width="11" height="11"/>
  <rect class="fill" x="73" y="239" width="11" height="11"/>
  <rect class="fill" x="86" y="239" width="11" height="11"/>
  <rect class="fill" x="99" y="239" width="11" height="11"/>
  <rect class="fill" x="112" y="239" width="11" height="11"/>
  <rect class="fill" x="125" y="239" width="11" height="11"/>
  <rect class="fill" x="138" y="239" width="11" height="11"/>
  <rect class="fill" x="151" y="239" width="11" height="11"/>
  <rect class="fill" x="164" y="239" width="11" height="11"/>
  <rect class="fill" x="177" y="239" width="11" height="11"/>
  <rect class="fill" x="190" y="239" width="11" height="11"/>
  <rect class="fill" x="203" y="239" width="11" height="11"/>
  <rect class="fill" x="216" y="239" width="11" height="11"/>
  <rect class="fill" x="229" y="239" width="11" height="11"/>
  <rect class="fill" x="242" y="239" width="11" height="11"/>
  <rect class="hot" x="255" y="239" width="11" height="11"/>
  <rect class="fill" x="268" y="239" width="11" height="11"/>
  <rect class="fill" x="281" y="239" width="11" height="11"/>
  <rect class="fill" x="294" y="239" width="11" height="11"/>
  <rect class="fill" x="307" y="239" width="11" height="11"/>
  <rect class="fill" x="320" y="239" width="11" height="11"/>
  <rect class="fill" x="333" y="239" width="11" height="11"/>
  <rect class="fill" x="346" y="239" width="11" height="11"/>
  <rect class="fill" x="359" y="239" width="11" height="11"/>
  <rect class="fill" x="372" y="239" width="11" height="11"/>
  <rect class="fill" x="385" y="239" width="11" height="11"/>
  <rect class="fill" x="398" y="239" width="11" height="11"/>
  <rect class="fill" x="411" y="239" width="11" height="11"/>
  <rect class="fill" x="424" y="239" width="11" height="11"/>
  <rect class="fill" x="437" y="239" width="11" height="11"/>
  <rect class="fill" x="450" y="239" width="11" height="11"/>
  <rect class="fill" x="463" y="239" width="11" height="11"/>
  <rect class="fill" x="60" y="252" width="11" height="11"/>
  <rect class="fill" x="73" y="252" width="11" height="11"/>
  <rect class="fill" x="86" y="252" width="11" height="11"/>
  <rect class="fill" x="99" y="252" width="11" height="11"/>
  <rect class="fill" x="112" y="252" width="11" height="11"/>
  <rect class="fill" x="125" y="252" width="11" height="11"/>
  <rect class="fill" x="138" y="252" width="11" height="11"/>
  <rect class="fill" x="151" y="252" width="11" height="11"/>
  <rect class="hot" x="164" y="252" width="11" height="11"/>
  <rect class="fill" x="177" y="252" width="11" height="11"/>
  <rect class="fill" x="190" y="252" width="11" height="11"/>
  <rect class="fill" x="203" y="252" width="11" height="11"/>
  <rect class="fill" x="216" y="252" width="11" height="11"/>
  <rect class="fill" x="229" y="252" width="11" height="11"/>
  <rect class="fill" x="242" y="252" width="11" height="11"/>
  <rect class="fill" x="255" y="252" width="11" height="11"/>
  <rect class="fill" x="268" y="252" width="11" height="11"/>
  <rect class="fill" x="281" y="252" width="11" height="11"/>
  <rect class="fill" x="294" y="252" width="11" height="11"/>
  <rect class="fill" x="307" y="252" width="11" height="11"/>
  <rect class="fill" x="320" y="252" width="11" height="11"/>
  <rect class="fill" x="333" y="252" width="11" height="11"/>
  <rect class="fill" x="346" y="252" width="11" height="11"/>
  <rect class="fill" x="359" y="252" width="11" height="11"/>
  <rect class="fill" x="372" y="252" width="11" height="11"/>
  <rect class="fill" x="385" y="252" width="11" height="11"/>
  <rect class="fill" x="398" y="252" width="11" height="11"/>
  <rect class="fill" x="411" y="252" width="11" height="11"/>
  <rect class="fill" x="424" y="252" width="11" height="11"/>
  <rect class="fill" x="437" y="252" width="11" height="11"/>
  <rect class="fill" x="450" y="252" width="11" height="11"/>
  <rect class="fill" x="463" y="252" width="11" height="11"/>
  <rect class="fill" x="60" y="265" width="11" height="11"/>
  <rect class="fill" x="73" y="265" width="11" height="11"/>
  <rect class="fill" x="86" y="265" width="11" height="11"/>
  <rect class="fill" x="99" y="265" width="11" height="11"/>
  <rect class="fill" x="112" y="265" width="11" height="11"/>
  <rect class="fill" x="125" y="265" width="11" height="11"/>
  <rect class="fill" x="138" y="265" width="11" height="11"/>
  <rect class="fill" x="151" y="265" width="11" height="11"/>
  <rect class="fill" x="164" y="265" width="11" height="11"/>
  <rect class="fill" x="177" y="265" width="11" height="11"/>
  <rect class="fill" x="190" y="265" width="11" height="11"/>
  <rect class="fill" x="203" y="265" width="11" height="11"/>
  <rect class="fill" x="216" y="265" width="11" height="11"/>
  <rect class="fill" x="229" y="265" width="11" height="11"/>
  <rect class="fill" x="242" y="265" width="11" height="11"/>
  <rect class="fill" x="255" y="265" width="11" height="11"/>
  <rect class="fill" x="268" y="265" width="11" height="11"/>
  <rect class="fill" x="281" y="265" width="11" height="11"/>
  <rect class="fill" x="294" y="265" width="11" height="11"/>
  <rect class="fill" x="307" y="265" width="11" height="11"/>
  <rect class="fill" x="320" y="265" width="11" height="11"/>
  <rect class="fill" x="333" y="265" width="11" height="11"/>
  <rect class="fill" x="346" y="265" width="11" height="11"/>
  <rect class="fill" x="359" y="265" width="11" height="11"/>
  <rect class="fill" x="372" y="265" width="11" height="11"/>
  <rect class="hot" x="385" y="265" width="11" height="11"/>
  <rect class="fill" x="398" y="265" width="11" height="11"/>
  <rect class="fill" x="411" y="265" width="11" height="11"/>
  <rect class="fill" x="424" y="265" width="11" height="11"/>
  <rect class="fill" x="437" y="265" width="11" height="11"/>
  <rect class="fill" x="450" y="265" width="11" height="11"/>
  <rect class="fill" x="463" y="265" width="11" height="11"/>
  <rect class="fill" x="60" y="278" width="11" height="11"/>
  <rect class="fill" x="73" y="278" width="11" height="11"/>
  <rect class="fill" x="86" y="278" width="11" height="11"/>
  <rect class="fill" x="99" y="278" width="11" height="11"/>
  <rect class="fill" x="112" y="278" width="11" height="11"/>
  <rect class="fill" x="125" y="278" width="11" height="11"/>
  <rect class="fill" x="138" y="278" width="11" height="11"/>
  <rect class="fill" x="151" y="278" width="11" height="11"/>
  <rect class="fill" x="164" y="278" width="11" height="11"/>
  <rect class="fill" x="177" y="278" width="11" height="11"/>
  <rect class="fill" x="190" y="278" width="11" height="11"/>
  <rect class="fill" x="203" y="278" width="11" height="11"/>
  <rect class="fill" x="216" y="278" width="11" height="11"/>
  <rect class="fill" x="229" y="278" width="11" height="11"/>
  <rect class="fill" x="242" y="278" width="11" height="11"/>
  <rect class="hot" x="255" y="278" width="11" height="11"/>
  <rect class="fill" x="268" y="278" width="11" height="11"/>
  <rect class="fill" x="281" y="278" width="11" height="11"/>
  <rect class="fill" x="294" y="278" width="11" height="11"/>
  <rect class="fill" x="307" y="278" width="11" height="11"/>
  <rect class="fill" x="320" y="278" width="11" height="11"/>
  <rect class="fill" x="333" y="278" width="11" height="11"/>
  <rect class="fill" x="346" y="278" width="11" height="11"/>
  <rect class="fill" x="359" y="278" width="11" height="11"/>
  <rect class="fill" x="372" y="278" width="11" height="11"/>
  <rect class="fill" x="385" y="278" width="11" height="11"/>
  <rect class="hot" x="398" y="278" width="11" height="11"/>
  <rect class="fill" x="411" y="278" width="11" height="11"/>
  <rect class="fill" x="424" y="278" width="11" height="11"/>
  <rect class="fill" x="437" y="278" width="11" height="11"/>
  <rect class="fill" x="450" y="278" width="11" height="11"/>
  <rect class="fill" x="463" y="278" width="11" height="11"/>
  <rect class="fill" x="60" y="291" width="11" height="11"/>
  <rect class="fill" x="73" y="291" width="11" height="11"/>
  <rect class="fill" x="86" y="291" width="11" height="11"/>
  <rect class="fill" x="99" y="291" width="11" height="11"/>
  <rect class="fill" x="112" y="291" width="11" height="11"/>
  <rect class="fill" x="125" y="291" width="11" height="11"/>
  <rect class="fill" x="138" y="291" width="11" height="11"/>
  <rect class="fill" x="151" y="291" width="11" height="11"/>
  <rect class="fill" x="164" y="291" width="11" height="11"/>
  <rect class="fill" x="177" y="291" width="11" height="11"/>
  <rect class="fill" x="190" y="291" width="11" height="11"/>
  <rect class="fill" x="203" y="291" width="11" height="11"/>
  <rect class="fill" x="216" y="291" width="11" height="11"/>
  <rect class="hot" x="229" y="291" width="11" height="11"/>
  <rect class="fill" x="242" y="291" width="11" height="11"/>
  <rect class="fill" x="255" y="291" width="11" height="11"/>
  <rect class="fill" x="268" y="291" width="11" height="11"/>
  <rect class="fill" x="281" y="291" width="11" height="11"/>
  <rect class="fill" x="294" y="291" width="11" height="11"/>
  <rect class="fill" x="307" y="291" width="11" height="11"/>
  <rect class="fill" x="320" y="291" width="11" height="11"/>
  <rect class="fill" x="333" y="291" width="11" height="11"/>
  <rect class="fill" x="346" y="291" width="11" height="11"/>
  <rect class="fill" x="359" y="291" width="11" height="11"/>
  <rect class="fill" x="372" y="291" width="11" height="11"/>
  <rect class="fill" x="385" y="291" width="11" height="11"/>
  <rect class="fill" x="398" y="291" width="11" height="11"/>
  <rect class="fill" x="411" y="291" width="11" height="11"/>
  <rect class="fill" x="424" y="291" width="11" height="11"/>
  <rect class="fill" x="437" y="291" width="11" height="11"/>
  <rect class="fill" x="450" y="291" width="11" height="11"/>
  <rect class="fill" x="463" y="291" width="11" height="11"/>
  <rect class="fill" x="60" y="304" width="11" height="11"/>
  <rect class="fill" x="73" y="304" width="11" height="11"/>
  <rect class="fill" x="86" y="304" width="11" height="11"/>
  <rect class="fill" x="99" y="304" width="11" height="11"/>
  <rect class="fill" x="112" y="304" width="11" height="11"/>
  <rect class="hot" x="125" y="304" width="11" height="11"/>
  <rect class="fill" x="138" y="304" width="11" height="11"/>
  <rect class="fill" x="151" y="304" width="11" height="11"/>
  <rect class="fill" x="164" y="304" width="11" height="11"/>
  <rect class="fill" x="177" y="304" width="11" height="11"/>
  <rect class="fill" x="190" y="304" width="11" height="11"/>
  <rect class="fill" x="203" y="304" width="11" height="11"/>
  <rect class="fill" x="216" y="304" width="11" height="11"/>
  <rect class="fill" x="229" y="304" width="11" height="11"/>
  <rect class="fill" x="242" y="304" width="11" height="11"/>
  <rect class="fill" x="255" y="304" width="11" height="11"/>
  <rect class="fill" x="268" y="304" width="11" height="11"/>
  <rect class="fill" x="281" y="304" width="11" height="11"/>
  <rect class="fill" x="294" y="304" width="11" height="11"/>
  <rect class="fill" x="307" y="304" width="11" height="11"/>
  <rect class="fill" x="320" y="304" width="11" height="11"/>
  <rect class="fill" x="333" y="304" width="11" height="11"/>
  <rect class="fill" x="346" y="304" width="11" height="11"/>
  <rect class="fill" x="359" y="304" width="11" height="11"/>
  <rect class="fill" x="372" y="304" width="11" height="11"/>
  <rect class="fill" x="385" y="304" width="11" height="11"/>
  <rect class="fill" x="398" y="304" width="11" height="11"/>
  <rect class="fill" x="411" y="304" width="11" height="11"/>
  <rect class="hot" x="424" y="304" width="11" height="11"/>
  <rect class="fill" x="437" y="304" width="11" height="11"/>
  <rect class="fill" x="450" y="304" width="11" height="11"/>
  <rect class="fill" x="463" y="304" width="11" height="11"/>
  <rect class="fill" x="60" y="317" width="11" height="11"/>
  <rect class="fill" x="73" y="317" width="11" height="11"/>
  <rect class="fill" x="86" y="317" width="11" height="11"/>
  <rect class="fill" x="99" y="317" width="11" height="11"/>
  <rect class="fill" x="112" y="317" width="11" height="11"/>
  <rect class="fill" x="125" y="317" width="11" height="11"/>
  <rect class="fill" x="138" y="317" width="11" height="11"/>
  <rect class="fill" x="151" y="317" width="11" height="11"/>
  <rect class="fill" x="164" y="317" width="11" height="11"/>
  <rect class="fill" x="177" y="317" width="11" height="11"/>
  <rect class="fill" x="190" y="317" width="11" height="11"/>
  <rect class="fill" x="203" y="317" width="11" height="11"/>
  <rect class="fill" x="216" y="317" width="11" height="11"/>
  <rect class="fill" x="229" y="317" width="11" height="11"/>
  <rect class="fill" x="242" y="317" width="11" height="11"/>
  <rect class="fill" x="255" y="317" width="11" height="11"/>
  <rect class="fill" x="268" y="317" width="11" height="11"/>
  <rect class="fill" x="281" y="317" width="11" height="11"/>
  <rect class="fill" x="294" y="317" width="11" height="11"/>
  <rect class="fill" x="307" y="317" width="11" height="11"/>
  <rect class="fill" x="320" y="317" width="11" height="11"/>
  <rect class="fill" x="333" y="317" width="11" height="11"/>
  <rect class="fill" x="346" y="317" width="11" height="11"/>
  <rect class="fill" x="359" y="317" width="11" height="11"/>
  <rect class="fill" x="372" y="317" width="11" height="11"/>
  <rect class="fill" x="385" y="317" width="11" height="11"/>
  <rect class="fill" x="398" y="317" width="11" height="11"/>
  <rect class="fill" x="411" y="317" width="11" height="11"/>
  <rect class="fill" x="424" y="317" width="11" height="11"/>
  <rect class="fill" x="437" y="317" width="11" height="11"/>
  <rect class="fill" x="450" y="317" width="11" height="11"/>
  <rect class="fill" x="463" y="317" width="11" height="11"/>
  <rect class="fill" x="60" y="330" width="11" height="11"/>
  <rect class="fill" x="73" y="330" width="11" height="11"/>
  <rect class="fill" x="86" y="330" width="11" height="11"/>
  <rect class="fill" x="99" y="330" width="11" height="11"/>
  <rect class="fill" x="112" y="330" width="11" height="11"/>
  <rect class="fill" x="125" y="330" width="11" height="11"/>
  <rect class="fill" x="138" y="330" width="11" height="11"/>
  <rect class="fill" x="151" y="330" width="11" height="11"/>
  <rect class="fill" x="164" y="330" width="11" height="11"/>
  <rect class="fill" x="177" y="330" width="11" height="11"/>
  <rect class="fill" x="190" y="330" width="11" height="11"/>
  <rect class="fill" x="203" y="330" width="11" height="11"/>
  <rect class="fill" x="216" y="330" width="11" height="11"/>
  <rect class="fill" x="229" y="330" width="11" height="11"/>
  <rect class="fill" x="242" y="330" width="11" height="11"/>
  <rect class="fill" x="255" y="330" width="11" height="11"/>
  <rect class="fill" x="268" y="330" width="11" height="11"/>
  <rect class="fill" x="281" y="330" width="11" height="11"/>
  <rect class="fill" x="294" y="330" width="11" height="11"/>
  <rect class="fill" x="307" y="330" width="11" height="11"/>
  <rect class="fill" x="320" y="330" width="11" height="11"/>
  <rect class="fill" x="333" y="330" width="11" height="11"/>
  <rect class="fill" x="346" y="330" width="11" height="11"/>
  <rect class="fill" x="359" y="330" width="11" height="11"/>
  <rect class="fill" x="372" y="330" width="11" height="11"/>
  <rect class="fill" x="385" y="330" width="11" height="11"/>
  <rect class="fill" x="398" y="330" width="11" height="11"/>
  <rect class="fill" x="411" y="330" width="11" height="11"/>
  <rect class="fill" x="424" y="330" width="11" height="11"/>
  <rect class="fill" x="437" y="330" width="11" height="11"/>
  <rect class="fill" x="450" y="330" width="11" height="11"/>
  <rect class="fill" x="463" y="330" width="11" height="11"/>
  <rect class="fill" x="60" y="343" width="11" height="11"/>
  <rect class="fill" x="73" y="343" width="11" height="11"/>
  <rect class="fill" x="86" y="343" width="11" height="11"/>
  <rect class="fill" x="99" y="343" width="11" height="11"/>
  <rect class="fill" x="112" y="343" width="11" height="11"/>
  <rect class="fill" x="125" y="343" width="11" height="11"/>
  <rect class="fill" x="138" y="343" width="11" height="11"/>
  <rect class="fill" x="151" y="343" width="11" height="11"/>
  <rect class="fill" x="164" y="343" width="11" height="11"/>
  <rect class="fill" x="177" y="343" width="11" height="11"/>
  <rect class="fill" x="190" y="343" width="11" height="11"/>
  <rect class="fill" x="203" y="343" width="11" height="11"/>
  <rect class="fill" x="216" y="343" width="11" height="11"/>
  <rect class="fill" x="229" y="343" width="11" height="11"/>
  <rect class="fill" x="242" y="343" width="11" height="11"/>
  <rect class="fill" x="255" y="343" width="11" height="11"/>
  <rect class="fill" x="268" y="343" width="11" height="11"/>
  <rect class="fill" x="281" y="343" width="11" height="11"/>
  <rect class="fill" x="294" y="343" width="11" height="11"/>
  <rect class="fill" x="307" y="343" width="11" height="11"/>
  <rect class="fill" x="320" y="343" width="11" height="11"/>
  <rect class="fill" x="333" y="343" width="11" height="11"/>
  <rect class="fill" x="346" y="343" width="11" height="11"/>
  <rect class="fill" x="359" y="343" width="11" height="11"/>
  <rect class="fill" x="372" y="343" width="11" height="11"/>
  <rect class="fill" x="385" y="343" width="11" height="11"/>
  <rect class="fill" x="398" y="343" width="11" height="11"/>
  <rect class="fill" x="411" y="343" width="11" height="11"/>
  <rect class="fill" x="424" y="343" width="11" height="11"/>
  <rect class="fill" x="437" y="343" width="11" height="11"/>
  <rect class="fill" x="450" y="343" width="11" height="11"/>
  <rect class="fill" x="463" y="343" width="11" height="11"/>
  <rect class="fill" x="60" y="356" width="11" height="11"/>
  <rect class="fill" x="73" y="356" width="11" height="11"/>
  <rect class="fill" x="86" y="356" width="11" height="11"/>
  <rect class="fill" x="99" y="356" width="11" height="11"/>
  <rect class="fill" x="112" y="356" width="11" height="11"/>
  <rect class="fill" x="125" y="356" width="11" height="11"/>
  <rect class="fill" x="138" y="356" width="11" height="11"/>
  <rect class="fill" x="151" y="356" width="11" height="11"/>
  <rect class="fill" x="164" y="356" width="11" height="11"/>
  <rect class="fill" x="177" y="356" width="11" height="11"/>
  <rect class="fill" x="190" y="356" width="11" height="11"/>
  <rect class="fill" x="203" y="356" width="11" height="11"/>
  <rect class="fill" x="216" y="356" width="11" height="11"/>
  <rect class="fill" x="229" y="356" width="11" height="11"/>
  <rect class="fill" x="242" y="356" width="11" height="11"/>
  <rect class="fill" x="255" y="356" width="11" height="11"/>
  <rect class="fill" x="268" y="356" width="11" height="11"/>
  <rect class="fill" x="281" y="356" width="11" height="11"/>
  <rect class="fill" x="294" y="356" width="11" height="11"/>
  <rect class="fill" x="307" y="356" width="11" height="11"/>
  <rect class="fill" x="320" y="356" width="11" height="11"/>
  <rect class="fill" x="333" y="356" width="11" height="11"/>
  <rect class="fill" x="346" y="356" width="11" height="11"/>
  <rect class="fill" x="359" y="356" width="11" height="11"/>
  <rect class="fill" x="372" y="356" width="11" height="11"/>
  <rect class="fill" x="385" y="356" width="11" height="11"/>
  <rect class="fill" x="398" y="356" width="11" height="11"/>
  <rect class="fill" x="411" y="356" width="11" height="11"/>
  <rect class="fill" x="424" y="356" width="11" height="11"/>
  <rect class="fill" x="437" y="356" width="11" height="11"/>
  <rect class="fill" x="450" y="356" width="11" height="11"/>
  <rect class="fill" x="463" y="356" width="11" height="11"/>
  <rect class="fill" x="60" y="369" width="11" height="11"/>
  <rect class="fill" x="73" y="369" width="11" height="11"/>
  <rect class="fill" x="86" y="369" width="11" height="11"/>
  <rect class="fill" x="99" y="369" width="11" height="11"/>
  <rect class="fill" x="112" y="369" width="11" height="11"/>
  <rect class="fill" x="125" y="369" width="11" height="11"/>
  <rect class="fill" x="138" y="369" width="11" height="11"/>
  <rect class="fill" x="151" y="369" width="11" height="11"/>
  <rect class="fill" x="164" y="369" width="11" height="11"/>
  <rect class="fill" x="177" y="369" width="11" height="11"/>
  <rect class="fill" x="190" y="369" width="11" height="11"/>
  <rect class="hot" x="203" y="369" width="11" height="11"/>
  <rect class="fill" x="216" y="369" width="11" height="11"/>
  <rect class="fill" x="229" y="369" width="11" height="11"/>
  <rect class="fill" x="242" y="369" width="11" height="11"/>
  <rect class="fill" x="255" y="369" width="11" height="11"/>
  <rect class="fill" x="268" y="369" width="11" height="11"/>
  <rect class="fill" x="281" y="369" width="11" height="11"/>
  <rect class="fill" x="294" y="369" width="11" height="11"/>
  <rect class="fill" x="307" y="369" width="11" height="11"/>
  <rect class="fill" x="320" y="369" width="11" height="11"/>
  <rect class="fill" x="333" y="369" width="11" height="11"/>
  <rect class="fill" x="346" y="369" width="11" height="11"/>
  <rect class="fill" x="359" y="369" width="11" height="11"/>
  <rect class="fill" x="372" y="369" width="11" height="11"/>
  <rect class="fill" x="385" y="369" width="11" height="11"/>
  <rect class="fill" x="398" y="369" width="11" height="11"/>
  <rect class="fill" x="411" y="369" width="11" height="11"/>
  <rect class="fill" x="424" y="369" width="11" height="11"/>
  <rect class="fill" x="437" y="369" width="11" height="11"/>
  <rect class="fill" x="450" y="369" width="11" height="11"/>
  <rect class="fill" x="463" y="369" width="11" height="11"/>
  <rect class="fill" x="60" y="382" width="11" height="11"/>
  <rect class="hot" x="73" y="382" width="11" height="11"/>
  <rect class="fill" x="86" y="382" width="11" height="11"/>
  <rect class="fill" x="99" y="382" width="11" height="11"/>
  <rect class="fill" x="112" y="382" width="11" height="11"/>
  <rect class="fill" x="125" y="382" width="11" height="11"/>
  <rect class="fill" x="138" y="382" width="11" height="11"/>
  <rect class="fill" x="151" y="382" width="11" height="11"/>
  <rect class="fill" x="164" y="382" width="11" height="11"/>
  <rect class="fill" x="177" y="382" width="11" height="11"/>
  <rect class="fill" x="190" y="382" width="11" height="11"/>
  <rect class="fill" x="203" y="382" width="11" height="11"/>
  <rect class="fill" x="216" y="382" width="11" height="11"/>
  <rect class="fill" x="229" y="382" width="11" height="11"/>
  <rect class="fill" x="242" y="382" width="11" height="11"/>
  <rect class="fill" x="255" y="382" width="11" height="11"/>
  <rect class="fill" x="268" y="382" width="11" height="11"/>
  <rect class="fill" x="281" y="382" width="11" height="11"/>
  <rect class="fill" x="294" y="382" width="11" height="11"/>
  <rect class="fill" x="307" y="382" width="11" height="11"/>
  <rect class="fill" x="320" y="382" width="11" height="11"/>
  <rect class="fill" x="333" y="382" width="11" height="11"/>
  <rect class="fill" x="346" y="382" width="11" height="11"/>
  <rect class="fill" x="359" y="382" width="11" height="11"/>
  <rect class="fill" x="372" y="382" width="11" height="11"/>
  <rect class="fill" x="385" y="382" width="11" height="11"/>
  <rect class="fill" x="398" y="382" width="11" height="11"/>
  <rect class="fill" x="411" y="382" width="11" height="11"/>
  <rect class="fill" x="424" y="382" width="11" height="11"/>
  <rect class="fill" x="437" y="382" width="11" height="11"/>
  <rect class="fill" x="450" y="382" width="11" height="11"/>
  <rect class="fill" x="463" y="382" width="11" height="11"/>
  <rect class="fill" x="60" y="395" width="11" height="11"/>
  <rect class="fill" x="73" y="395" width="11" height="11"/>
  <rect class="fill" x="86" y="395" width="11" height="11"/>
  <rect class="fill" x="99" y="395" width="11" height="11"/>
  <rect class="fill" x="112" y="395" width="11" height="11"/>
  <rect class="fill" x="125" y="395" width="11" height="11"/>
  <rect class="fill" x="138" y="395" width="11" height="11"/>
  <rect class="fill" x="151" y="395" width="11" height="11"/>
  <rect class="fill" x="164" y="395" width="11" height="11"/>
  <rect class="fill" x="177" y="395" width="11" height="11"/>
  <rect class="fill" x="190" y="395" width="11" height="11"/>
  <rect class="fill" x="203" y="395" width="11" height="11"/>
  <rect class="fill" x="216" y="395" width="11" height="11"/>
  <rect class="fill" x="229" y="395" width="11" height="11"/>
  <rect class="fill" x="242" y="395" width="11" height="11"/>
  <rect class="fill" x="255" y="395" width="11" height="11"/>
  <rect class="fill" x="268" y="395" width="11" height="11"/>
  <rect class="fill" x="281" y="395" width="11" height="11"/>
  <rect class="fill" x="294" y="395" width="11" height="11"/>
  <rect class="fill" x="307" y="395" width="11" height="11"/>
  <rect class="fill" x="320" y="395" width="11" height="11"/>
  <rect class="fill" x="333" y="395" width="11" height="11"/>
  <rect class="fill" x="346" y="395" width="11" height="11"/>
  <rect class="fill" x="359" y="395" width="11" height="11"/>
  <rect class="fill" x="372" y="395" width="11" height="11"/>
  <rect class="fill" x="385" y="395" width="11" height="11"/>
  <rect class="fill" x="398" y="395" width="11" height="11"/>
  <rect class="fill" x="411" y="395" width="11" height="11"/>
  <rect class="fill" x="424" y="395" width="11" height="11"/>
  <rect class="fill" x="437" y="395" width="11" height="11"/>
  <rect class="fill" x="450" y="395" width="11" height="11"/>
  <rect class="fill" x="463" y="395" width="11" height="11"/>
  <rect class="fill" x="60" y="408" width="11" height="11"/>
  <rect class="fill" x="73" y="408" width="11" height="11"/>
  <rect class="fill" x="86" y="408" width="11" height="11"/>
  <rect class="fill" x="99" y="408" width="11" height="11"/>
  <rect class="fill" x="112" y="408" width="11" height="11"/>
  <rect class="fill" x="125" y="408" width="11" height="11"/>
  <rect class="hot" x="138" y="408" width="11" height="11"/>
  <rect class="fill" x="151" y="408" width="11" height="11"/>
  <rect class="fill" x="164" y="408" width="11" height="11"/>
  <rect class="fill" x="177" y="408" width="11" height="11"/>
  <rect class="fill" x="190" y="408" width="11" height="11"/>
  <rect class="fill" x="203" y="408" width="11" height="11"/>
  <rect class="fill" x="216" y="408" width="11" height="11"/>
  <rect class="fill" x="229" y="408" width="11" height="11"/>
  <rect class="fill" x="242" y="408" width="11" height="11"/>
  <rect class="fill" x="255" y="408" width="11" height="11"/>
  <rect class="fill" x="268" y="408" width="11" height="11"/>
  <rect class="fill" x="281" y="408" width="11" height="11"/>
  <rect class="hot" x="294" y="408" width="11" height="11"/>
  <rect class="fill" x="307" y="408" width="11" height="11"/>
  <rect class="fill" x="320" y="408" width="11" height="11"/>
  <rect class="fill" x="333" y="408" width="11" height="11"/>
  <rect class="fill" x="346" y="408" width="11" height="11"/>
  <rect class="fill" x="359" y="408" width="11" height="11"/>
  <rect class="fill" x="372" y="408" width="11" height="11"/>
  <rect class="fill" x="385" y="408" width="11" height="11"/>
  <rect class="fill" x="398" y="408" width="11" height="11"/>
  <rect class="fill" x="411" y="408" width="11" height="11"/>
  <rect class="fill" x="424" y="408" width="11" height="11"/>
  <rect class="hot" x="437" y="408" width="11" height="11"/>
  <rect class="hot" x="450" y="408" width="11" height="11"/>
  <rect class="hot" x="463" y="408" width="11" height="11"/>
  <rect class="fill" x="60" y="421" width="11" height="11"/>
  <rect class="fill" x="73" y="421" width="11" height="11"/>
  <rect class="fill" x="86" y="421" width="11" height="11"/>
  <rect class="fill" x="99" y="421" width="11" height="11"/>
  <rect class="fill" x="112" y="421" width="11" height="11"/>
  <rect class="fill" x="125" y="421" width="11" height="11"/>
  <rect class="fill" x="138" y="421" width="11" height="11"/>
  <rect class="fill" x="151" y="421" width="11" height="11"/>
  <rect class="hot" x="164" y="421" width="11" height="11"/>
  <rect class="fill" x="177" y="421" width="11" height="11"/>
  <rect class="fill" x="190" y="421" width="11" height="11"/>
  <rect class="fill" x="203" y="421" width="11" height="11"/>
  <rect class="fill" x="216" y="421" width="11" height="11"/>
  <rect class="fill" x="229" y="421" width="11" height="11"/>
  <rect class="fill" x="242" y="421" width="11" height="11"/>
  <rect class="fill" x="255" y="421" width="11" height="11"/>
  <rect class="fill" x="268" y="421" width="11" height="11"/>
  <rect class="fill" x="281" y="421" width="11" height="11"/>
  <rect class="fill" x="294" y="421" width="11" height="11"/>
  <rect class="fill" x="307" y="421" width="11" height="11"/>
  <rect class="fill" x="320" y="421" width="11" height="11"/>
  <rect class="fill" x="333" y="421" width="11" height="11"/>
  <rect class="hot" x="346" y="421" width="11" height="11"/>
  <rect class="fill" x="359" y="421" width="11" height="11"/>
  <rect class="fill" x="372" y="421" width="11" height="11"/>
  <rect class="hot" x="385" y="421" width="11" height="11"/>
  <rect class="fill" x="398" y="421" width="11" height="11"/>
  <rect class="fill" x="411" y="421" width="11" height="11"/>
  <rect class="fill" x="424" y="421" width="11" height="11"/>
  <rect class="fill" x="437" y="421" width="11" height="11"/>
  <rect class="fill" x="450" y="421" width="11" height="11"/>
  <rect class="fill" x="463" y="421" width="11" height="11"/>
  <rect class="fill" x="60" y="434" width="11" height="11"/>
  <rect class="fill" x="73" y="434" width="11" height="11"/>
  <rect class="fill" x="86" y="434" width="11" height="11"/>
  <rect class="fill" x="99" y="434" width="11" height="11"/>
  <rect class="fill" x="112" y="434" width="11" height="11"/>
  <rect class="fill" x="125" y="434" width="11" height="11"/>
  <rect class="fill" x="138" y="434" width="11" height="11"/>
  <rect class="fill" x="151" y="434" width="11" height="11"/>
  <rect class="fill" x="164" y="434" width="11" height="11"/>
  <rect class="fill" x="177" y="434" width="11" height="11"/>
  <rect class="fill" x="190" y="434" width="11" height="11"/>
  <rect class="fill" x="203" y="434" width="11" height="11"/>
  <rect class="fill" x="216" y="434" width="11" height="11"/>
  <rect class="fill" x="229" y="434" width="11" height="11"/>
  <rect class="hot" x="242" y="434" width="11" height="11"/>
  <rect class="fill" x="255" y="434" width="11" height="11"/>
  <rect class="fill" x="268" y="434" width="11" height="11"/>
  <rect class="fill" x="281" y="434" width="11" height="11"/>
  <rect class="fill" x="294" y="434" width="11" height="11"/>
  <rect class="fill" x="307" y="434" width="11" height="11"/>
  <rect class="fill" x="320" y="434" width="11" height="11"/>
  <rect class="fill" x="333" y="434" width="11" height="11"/>
  <rect class="fill" x="346" y="434" width="11" height="11"/>
  <rect class="fill" x="359" y="434" width="11" height="11"/>
  <rect class="fill" x="372" y="434" width="11" height="11"/>
  <rect class="fill" x="385" y="434" width="11" height="11"/>
  <rect class="fill" x="398" y="434" width="11" height="11"/>
  <rect class="fill" x="411" y="434" width="11" height="11"/>
  <rect class="fill" x="424" y="434" width="11" height="11"/>
  <rect class="fill" x="437" y="434" width="11" height="11"/>
  <rect class="fill" x="450" y="434" width="11" height="11"/>
  <rect class="fill" x="463" y="434" width="11" height="11"/>
  <rect class="fill" x="60" y="447" width="11" height="11"/>
  <rect class="fill" x="73" y="447" width="11" height="11"/>
  <rect class="fill" x="86" y="447" width="11" height="11"/>
  <rect class="fill" x="99" y="447" width="11" height="11"/>
  <rect class="fill" x="112" y="447" width="11" height="11"/>
  <rect class="fill" x="125" y="447" width="11" height="11"/>
  <rect class="fill" x="138" y="447" width="11" height="11"/>
  <rect class="fill" x="151" y="447" width="11" height="11"/>
  <rect class="fill" x="164" y="447" width="11" height="11"/>
  <rect class="fill" x="177" y="447" width="11" height="11"/>
  <rect class="fill" x="190" y="447" width="11" height="11"/>
  <rect class="fill" x="203" y="447" width="11" height="11"/>
  <rect class="fill" x="216" y="447" width="11" height="11"/>
  <rect class="fill" x="229" y="447" width="11" height="11"/>
  <rect class="fill" x="242" y="447" width="11" height="11"/>
  <rect class="fill" x="255" y="447" width="11" height="11"/>
  <rect class="fill" x="268" y="447" width="11" height="11"/>
  <rect class="fill" x="281" y="447" width="11" height="11"/>
  <rect class="fill" x="294" y="447" width="11" height="11"/>
  <rect class="fill" x="307" y="447" width="11" height="11"/>
  <rect class="fill" x="320" y="447" width="11" height="11"/>
  <rect class="fill" x="333" y="447" width="11" height="11"/>
  <rect class="fill" x="346" y="447" width="11" height="11"/>
  <rect class="fill" x="359" y="447" width="11" height="11"/>
  <rect class="fill" x="372" y="447" width="11" height="11"/>
  <rect class="fill" x="385" y="447" width="11" height="11"/>
  <rect class="fill" x="398" y="447" width="11" height="11"/>
  <rect class="fill" x="411" y="447" width="11" height="11"/>
  <rect class="fill" x="424" y="447" width="11" height="11"/>
  <rect class="fill" x="437" y="447" width="11" height="11"/>
  <rect class="fill" x="450" y="447" width="11" height="11"/>
  <rect class="hot" x="463" y="447" width="11" height="11"/>
  <text class="tf" x="52" y="54" text-anchor="end">layer 0</text>
  <text class="tf" x="52" y="456" text-anchor="end">layer 31</text>
  <line class="rule" x1="20" y1="480" x2="600" y2="480"/>
  <text class="tm" x="20" y="502">Filled: the roughly 3 to 6 per cent identified as retrieval</text>
  <text class="tm" x="20" y="518">heads. Pruning them causes retrieval to fail and the model to</text>
  <text class="tm" x="20" y="534">hallucinate; pruning as many random heads does not.</text>
</svg><figcaption><span class="label">Figure 2</span> The sparsity of the retrieval-head set,
drawn at the scale of a thirty-two-layer, thirty-two-head model. The specific positions
shown are illustrative rather than measured; the quantity being conveyed is the proportion
and the fact that pruning that proportion at random has no comparable effect. Drawn from
the criterion and controls reported in Wu et al. (2025).</figcaption>
</figure>

The controls are what make the claim causal rather than correlational. Wu et al. (2025)
report that masking approximately five per cent of heads drops needle-in-a-haystack
performance below fifty for every model tested, and that on held-out extractive question
answering, masking retrieval heads costs 9.2 and 23.1 per cent F1 while masking the same
number of random non-retrieval heads shows no significant impact. The result holds across
Llama-2 at several sizes and context lengths, Mistral-7B, Mixtral-8x7B, Yi at 6B and 34B,
and Qwen1.5-14B. In addition, Zhao, Yin and Durrett (2025) independently re-derive the same head population
by attention knockout and activation patching, concluding that the heads are necessary and
explain model performance although they are not entirely sufficient.

<div class="tenet">
<p class="label">What the evidence supports</p>
<p>That literal copying out of a long context depends on a small, identifiable set of
heads; that removing them produces confident fabrication rather than refusal; and that the
same machinery is load-bearing for chain-of-thought prompting but not for answer-only
prompting.</p>
<p class="label" style="margin-top:14px">What it does not</p>
<p>That the same heads carry context-grounded synthesis. The detection criterion is
literal copying by construction, so any non-literal retrieval is invisible to it, and
sufficiency was not established.</p>
</div>

One further result deserves separate statement because it bears on a widespread practice.
Wu et al. (2025) find that masking retrieval heads degrades chain-of-thought prompting on
multi-step benchmarks while leaving answer-only prompting comparatively unaffected, which
suggests that extended reasoning depends on the same narrow copying machinery to carry
intermediate results forward. Therefore, a long agent trajectory does not merely accumulate more
context; it leans more heavily on the component whose documented failure mode is
fabrication (Wu et al., 2025).

## The ordering of an agent context

Everything below is an extrapolation. Every model in the cited work is an open-weight
decoder-only model of the 2023 to 2024 generation, or a proprietary model of that period,
and the tasks are templated retrieval tasks rather than repository edits performed over
many turns with tools (Liu et al., 2024; Wu et al., 2025).

<figure>
<svg class="dg" viewBox="0 0 620 330" role="img" aria-labelledby="ttl-lay">
  <title id="ttl-lay">A context ordering that respects the positional evidence</title>
  <rect class="hot"  x="150" y="30"  width="320" height="46"/>
  <text class="tr" x="166" y="50">role, constraints, acceptance criteria</text>
  <text class="tr" x="166" y="66" opacity="0.72">the instructions you cannot afford to lose</text>
  <rect class="fill" x="150" y="82" width="320" height="40"/>
  <text class="t" x="166" y="100">worked example of the change you want</text>
  <text class="tm" x="166" y="114">one is usually enough</text>
  <rect class="box" x="150" y="128" width="320" height="94"/>
  <text class="tm" x="166" y="150">retrieved files, diffs, logs, schemas</text>
  <text class="tm" x="166" y="166">the bulk of the context</text>
  <text class="tf" x="166" y="196">degraded retrieval through here</text>
  <text class="tf" x="166" y="210">keep it short rather than complete</text>
  <rect class="fill" x="150" y="228" width="320" height="40"/>
  <text class="t" x="166" y="246">the concrete task, restated</text>
  <text class="tm" x="166" y="260">in the words you want the agent to use</text>
  <rect class="hot"  x="150" y="274" width="320" height="34"/>
  <text class="tr" x="166" y="295">what to output, and in what form</text>
  <path class="line" d="M 128 30 L 118 30 L 118 122 L 128 122"/>
  <text class="tf" x="110" y="72" text-anchor="end">start</text>
  <path class="line" d="M 128 228 L 118 228 L 118 308 L 128 308"/>
  <text class="tf" x="110" y="272" text-anchor="end">end</text>
  <path class="dash" d="M 128 128 L 118 128 L 118 222 L 128 222"/>
  <text class="tf" x="110" y="178" text-anchor="end">middle</text>
  <text class="tf" x="486" y="52">high retrieval</text>
  <text class="tf" x="486" y="178">low retrieval</text>
  <text class="tf" x="486" y="294">high retrieval</text>
</svg><figcaption><span class="label">Figure 3</span> A context ordering consistent with the
positional evidence. The instructions and the operative task statement occupy the
extremities; retrieved material occupies the middle, where retrievability is weakest and
where brevity therefore buys more than completeness. The figure encodes the recommendation
rather than a measurement, and it should be read as one defensible arrangement rather than
an optimum, since no cited study compared prompt layouts on an agentic coding task.</figcaption>
</figure>

### A budget for the context window

The finding that an extended window does not change the positional profile (Liu et al.,
2024) converts the context window from a capacity to be filled into a budget to be spent.
The following allocation is a defensible default for a long-horizon coding task.

| Region | Contents | Discipline |
| --- | --- | --- |
| Opening | Role, hard constraints, acceptance criteria | Never elided, never summarised |
| Early | One worked example of the change wanted | A single example, per the first note |
| Middle | Retrieved files, diffs, logs, schemas | Cut first, cut hardest |
| Late | The concrete task, restated | Written in the words the agent should use |
| Closing | Required output form, verbatim identifiers | Repeated even if stated at the top |

The asymmetry is the point. Material in the opening and closing regions earns its tokens;
material in the middle is competing for the region where Liu et al. (2024) measure the
lowest retrieval, so the marginal file added there is the least likely to be used and the
most likely to displace attention from something that would have been.

### The material to cut first

Because the degradation is positional rather than semantic, the decision of what to remove
cannot be made by relevance alone. The following order has served, from first cut to last.

1. Whole files where a single function was needed.
2. Vendored or generated code, including lockfiles and protobuf output.
3. Test files not being changed, where the convention is already stated as a constraint.
4. Directory listings beyond the paths actually in play.
5. Prior turns of the conversation whose conclusions have already been written down.
6. Documentation that restates what the code shows.

An agent that reads a file itself, on demand, spends the tokens only when the file is
needed and places them at the end of the context rather than in the middle, which is the
better position on both counts. Consequently, a tool call is frequently preferable to a
paste, and the common instinct to front-load the context with everything that might be
relevant is close to the worst available arrangement.

### The verbatim block

Wu et al. (2025) establish that copying from context is carried by heads identified by a
literal copy-paste criterion, and Modarressi et al. (2025) attribute much long-context
failure to the absence of literal lexical overlap between the query and the target.
Therefore, anything the agent must reproduce exactly should appear in the context exactly,
rather than being described.

```text
Paths, symbols and strings — reproduce these exactly, do not retype from memory:

  file        internal/config/parse.go
  function    func ParseTimeout(raw string) (time.Duration, error)
  error       "config: timeout must be a positive duration"
  test        go test ./internal/config -run TestParseTimeout
  do not touch internal/config/parse_test.go
```

The table below is the operative distinction.

| Supply verbatim | Safe to describe |
| --- | --- |
| File paths and package names | The intent of the change |
| Full function signatures | Why the change is wanted |
| Exact error and log strings | The acceptance criteria |
| Environment variable names | Background on the subsystem |
| The exact command to run | Style preferences already in the instruction file |

### Re-anchoring at the end of a long turn

Because recency is the more robust half of the positional finding (Liu et al., 2024), the
operative instruction should be the last thing in the context rather than the first, and
should be restated rather than referred back to. In an agent loop this means restating the
task after a long tool result, not merely at the start of the session.

```text
[... 40k tokens of file contents and test output ...]

Restating the task, which has not changed:
  Make TestParseTimeout pass without altering the error string.
  Do not modify parse_test.go. Report the diff and the test output.
```

The same reasoning applies to context compaction and to subagents. A summary that
preserves the substance of the middle while dropping the opening constraints and the
closing restatement has discarded the two regions the evidence says are most used, and a
subagent launched with only the middle inherits a context with no anchor at either end.

### A verification step for fabricated identifiers

The documented failure mode of the retrieval mechanism is hallucination rather than
abstention (Wu et al., 2025), and a fabricated identifier is plausible by construction.
Accordingly, the check that matters is mechanical rather than editorial: every path,
symbol and command an agent emits should be confirmed to exist before the output is
trusted.

```bash
# Every path the agent mentioned must exist in the repository.
grep -oE '[a-zA-Z0-9_./-]+\.(go|ts|py|md)' agent-output.txt | sort -u |
  while read -r f; do [ -e "$f" ] || echo "MISSING PATH: $f"; done

# Every symbol it claimed to call must be defined somewhere.
grep -oE '\b[A-Z][A-Za-z0-9]+\(' agent-output.txt | tr -d '(' | sort -u |
  while read -r s; do
    rg -q "func \($s\b|func $s\b" . || echo "UNDEFINED SYMBOL: $s"
  done
```

Two properties make this worth automating rather than eyeballing. The failure is silent,
since a fabricated path is syntactically indistinguishable from a real one; and it becomes
more likely precisely as the context grows, which is the regime in which an operator is
least inclined to read carefully.

### A checklist for a long context

1. The hard constraints appear in the first two hundred tokens.
2. The operative task is restated in the last two hundred tokens.
3. Every identifier the agent must reproduce appears verbatim somewhere in the context.
4. Nothing in the middle region is there because it might be useful.
5. A tool call has been preferred to a paste wherever the agent can fetch the file itself.
6. Compaction and subagent prompts preserve the opening and closing regions, not only the
   middle.
7. The output is passed through an existence check for paths and symbols before it is
   reviewed on its merits.

## Conclusion

It was first established that the position of information within a long context materially
changes whether a model uses it, under a design that holds content constant and permutes
only order. Next, it was shown that adopting an extended-context variant does not remedy
this, with the positional profiles of models and their long-context variants essentially
superimposed, and that the degradation persists in current models under harder
evaluations. It was then argued that the copying of context into output is carried by a
sparse, universal and causally established set of retrieval heads, that pruning them
produces fabrication while pruning as many random heads does not, and that chain-of-thought
prompting depends on this same machinery. Finally, a context budget was set out,
together with a cutting order, a verbatim block, the practice of restating the task last,
and an existence check to run over an agent's output, all of it marked as extrapolation. A common thread running through these findings is that the
constraint is not how much context a model can be given but which parts of it the model can
still reach, and that the two have been conflated in practice. As a next step, the
distinction between literal copying and context-grounded synthesis deserves attention from
practitioners, because the detection criterion behind the retrieval-head result covers only
the former while an agent writing new code consistent with a file it has read is doing the
latter.

[The third note](/blog/surface-form-self-repair-and-the-limits-of-circuit-evidence/) takes up what these results do not license, and why the surface form
of a prompt turns out to be a causal input rather than decoration. [The first](/blog/induction-heads-function-vectors-and-demonstrations/) covered
induction heads and function vectors.

## References

<ol class="refs">
<li>Hsieh, C.-P., Sun, S., Kriman, S., Acharya, S., Rekesh, D., Jia, F., Zhang, Y., &amp; Ginsburg, B. (2024). RULER: what&rsquo;s the real context size of your long-context language models? <a href="https://arxiv.org/abs/2404.06654">arXiv:2404.06654</a>.</li>
<li>Hsieh, C.-Y., Chuang, Y.-S., Li, C.-L., Wang, Z., Le, L. T., Kumar, A., et al. (2024). Found in the middle: calibrating positional attention bias improves long context utilization. <em>Findings of ACL 2024</em>. <a href="https://arxiv.org/abs/2406.16008">arXiv:2406.16008</a>.</li>
<li>Liu, N. F., Lin, K., Hewitt, J., Paranjape, A., Bevilacqua, M., Petroni, F., &amp; Liang, P. (2024). Lost in the middle: how language models use long contexts. <a href="https://aclanthology.org/2024.tacl-1.9/"><em>Transactions of the Association for Computational Linguistics</em>, 12, 157-173</a>.</li>
<li>Modarressi, A., Deilamsalehy, H., Dernoncourt, F., Bui, T., Rossi, R. A., Yoon, S., &amp; Schütze, H. (2025). NoLiMa: long-context evaluation beyond literal matching. <a href="https://arxiv.org/abs/2502.05167">arXiv:2502.05167</a>.</li>
<li>Wu, W., Wang, Y., Xiao, G., Peng, H., &amp; Fu, Y. (2025). Retrieval head mechanistically explains long-context factuality. <em>International Conference on Learning Representations</em>. <a href="https://arxiv.org/abs/2404.15574">arXiv:2404.15574</a>.</li>
<li>Salvatore, N., Wang, H., &amp; Zhang, Q. (2025). Lost in the middle: an emergent property from information retrieval demands in LLMs. <a href="https://arxiv.org/abs/2510.10276">arXiv:2510.10276</a>.</li>
<li>Zhao, X., Yin, F., &amp; Durrett, G. (2025). Understanding synthetic context extension via retrieval heads. <em>International Conference on Machine Learning</em>. <a href="https://arxiv.org/abs/2410.22316">arXiv:2410.22316</a>.</li>
</ol>
