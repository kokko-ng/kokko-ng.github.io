---
title: "Data Structures and Algorithms as a Frame for Prompting"
description: "What circuit complexity actually establishes about the limits of a single forward pass, why decomposition buys serial depth rather than tidiness, and how the ordinary vocabulary of data structures applies to an agent's context."
pubDate: 2026-08-29
tags: ["algorithms", "prompting", "agents"]
---

The following discussion maintains that the elementary vocabulary of data structures and
algorithms describes the constraints on prompting more accurately than the vocabulary of
instruction and persuasion does, and that one part of this correspondence is a theorem rather
than an analogy. It will be shown that a transformer's single forward pass is a bounded-depth
parallel computation, which places a hard ceiling on how many steps it can compose before
emitting a token. Next, it will be argued that intermediate generation lifts that ceiling by
an amount proportional to the number of steps generated, and that this has been characterised
exactly in terms of standard complexity classes. It will then be argued that the empirical
results on compositional tasks track the theoretical picture, because measured accuracy falls
as the depth of a task's computation graph rises (Dziri et al., 2023). Lastly, the data-structure half of the
correspondence will be set out — the context as a non-uniform-cost store, the file system as
external memory, sampling as randomised search, and verification as the cheap half of an
asymmetric pair — together with what the correspondence does not license. It should be noted
at the outset that the complexity results concern idealised model classes rather than any
deployed system, and that every prompting recommendation below is an extrapolation, marked as
such where it appears.

## The ceiling on a single forward pass

A transformer's forward pass is a bounded-depth, highly parallel computation, and that
property places a formal limit on what it can decide in one step. Merrill and Sabharwal
(2023) prove that log-precision transformers can be simulated by constant-depth,
polynomial-size threshold circuits, placing them inside the complexity class uniform TC0,
which is the class of problems solvable by such circuits. The consequence is not a statement
about difficulty but about composition. A constant-depth circuit cannot chain an unbounded
number of dependent steps regardless of its width (Merrill & Sabharwal, 2023). Merrill and Sabharwal (2024)
give the concrete cases, noting that problems as simple as checking whether two nodes in a
graph are connected, or simulating a finite-state machine, are provably beyond a standard
transformer that answers immediately after reading its input. Figure 1 sets out the shape of
the limit. In sum, the constraint on a single pass is serial rather than quantitative,
because width and parameter count do not substitute for depth.

<figure>
<svg class="dg" viewBox="0 0 620 268" role="img" aria-labelledby="ttl-depth">
<title id="ttl-depth">A bounded-depth pass against steps unrolled into the output</title>
<text class="tf" x="20" y="20">One forward pass: fixed depth, unbounded width</text>
<rect class="box" x="20" y="32" width="270" height="22"/>
<rect class="box" x="20" y="60" width="270" height="22"/>
<rect class="box" x="20" y="88" width="270" height="22"/>
<text class="tm" x="155" y="47" text-anchor="middle">layer 1</text>
<text class="tm" x="155" y="75" text-anchor="middle">layer 2</text>
<text class="tm" x="155" y="103" text-anchor="middle">layer L</text>
<path class="line" d="M 300 71 L 322 71"/><polygon class="arrow" points="328,71 317,67 317,75"/>
<rect class="hot" x="328" y="60" width="60" height="22"/>
<text class="tr" x="358" y="75" text-anchor="middle">answer</text>
<text class="tf" x="404" y="76">depth is fixed by L</text>
<text class="tf" x="20" y="146">With intermediate generation: depth grows with the number of steps</text>
<rect class="box" x="20" y="158" width="52" height="22"/>
<rect class="box" x="80" y="158" width="52" height="22"/>
<rect class="box" x="140" y="158" width="52" height="22"/>
<rect class="box" x="200" y="158" width="52" height="22"/>
<rect class="box" x="260" y="158" width="52" height="22"/>
<rect class="hot" x="320" y="158" width="60" height="22"/>
<text class="tm" x="46" y="173" text-anchor="middle">t1</text>
<text class="tm" x="106" y="173" text-anchor="middle">t2</text>
<text class="tm" x="166" y="173" text-anchor="middle">t3</text>
<text class="tm" x="226" y="173" text-anchor="middle">t4</text>
<text class="tm" x="286" y="173" text-anchor="middle">t5</text>
<text class="tr" x="350" y="173" text-anchor="middle">answer</text>
<path class="line" d="M 72 169 L 76 169"/>
<path class="line" d="M 132 169 L 136 169"/>
<path class="line" d="M 192 169 L 196 169"/>
<path class="line" d="M 252 169 L 256 169"/>
<path class="line" d="M 312 169 L 316 169"/>
<path class="rule" d="M 20 200 L 600 200"/>
<text class="tf" x="20" y="220">Steps generated</text>
<text class="tf" x="330" y="220">What is added</text>
<text class="tm" x="20" y="240">logarithmic in the input</text>
<text class="tm" x="330" y="240">very little beyond the standard limit</text>
<text class="tm" x="20" y="258">linear · polynomial</text>
<text class="tm" x="330" y="258">all regular languages · exactly P</text>
</svg>
<figcaption><span class="label">Figure 1</span> The fixed depth of a single forward pass
against the depth obtained by generating intermediate tokens, with the complexity classes
each regime buys. The classes hold for idealised decoder models under the precision and
normalisation assumptions the authors state, and the figure does not claim that any deployed
model attains them. Drawn from Merrill and Sabharwal (2023, 2024).</figcaption>
</figure>

## The serial depth bought by intermediate generation

Generating intermediate tokens extends what a transformer can compute, and the extension has
been characterised exactly rather than qualitatively. Merrill and Sabharwal (2024) show that
a logarithmic number of decoding steps pushes the limits of a standard transformer only
slightly, whereas a linear number of steps, under a mild generalisation of standard pre-norm,
adds the ability to recognise all regular languages under standard complexity conjectures.
The upper end of the characterisation is sharper still, because Merrill and Sabharwal (2024)
establish that polynomially many steps with generalised pre-norm make transformer decoders
recognise exactly the class of polynomial-time solvable problems. It must be noted that these
are statements about a model class under stated assumptions and not measurements of any
particular system, which is the standard limitation of results of this kind. Accordingly, the
serial length of a model's own output is a computational resource, because the theorems
quantify the ability gained per unit of it.

## The empirical decay with compositional depth

The measured behaviour of deployed models tracks the theoretical picture, in that accuracy
falls as the number of composed steps rises. Dziri et al. (2023) formulate compositional
tasks as computation graphs in order to quantify complexity systematically, and report that
performance decays rapidly as task depth increases. The mechanism they propose is that
transformers reduce multi-step reasoning to linearised subgraph matching rather than
developing a general procedure. That mechanism predicts exactly the observed decay (Dziri et
al., 2023). Press et al. (2023) established a complementary result under the name of the
compositionality gap, finding that models answer the constituent sub-questions of a
multi-hop question correctly while failing to compose those answers. Figure 2 sets out the
relationship. Therefore the practical failure mode is not ignorance of the parts but an
inability to chain them, because the parts are answered correctly in the same studies that
find the chain broken.

<figure>
<svg class="dg" viewBox="0 0 620 236" role="img" aria-labelledby="ttl-graph">
<title id="ttl-graph">Accuracy against the depth of a task's computation graph</title>
<path class="rule" d="M 70 30 L 70 170 L 420 170"/>
<text class="tf" x="20" y="34">accuracy</text>
<text class="tf" x="380" y="190">graph depth</text>
<path class="band" d="M 70 40 L 140 62 L 210 108 L 280 140 L 350 156 L 420 164 L 420 170 L 70 170 Z"/>
<path class="plot" d="M 70 40 L 140 62 L 210 108 L 280 140 L 350 156 L 420 164"/>
<text class="tf" x="70" y="186">1</text>
<text class="tf" x="210" y="186">3</text>
<text class="tf" x="350" y="186">5</text>
<rect class="box" x="460" y="40" width="140" height="26"/>
<rect class="box" x="460" y="76" width="140" height="26"/>
<rect class="box" x="460" y="112" width="140" height="26"/>
<rect class="hot" x="460" y="148" width="140" height="26"/>
<text class="t" x="530" y="57" text-anchor="middle">sub-answer A</text>
<text class="t" x="530" y="93" text-anchor="middle">sub-answer B</text>
<text class="t" x="530" y="129" text-anchor="middle">sub-answer C</text>
<text class="tr" x="530" y="165" text-anchor="middle">composition</text>
<path class="line" d="M 530 66 L 530 72"/>
<path class="line" d="M 530 102 L 530 108"/>
<path class="line" d="M 530 138 L 530 144"/>
<text class="tf" x="460" y="196">each part answered</text>
<text class="tf" x="460" y="212">the chain fails</text>
<text class="tf" x="20" y="230">the curve is schematic: it represents the reported direction of decay, not published values</text>
</svg>
<figcaption><span class="label">Figure 2</span> The reported decay of accuracy with
computation-graph depth, beside the compositionality gap in which each sub-answer is correct
and their composition is not. The curve is schematic and carries no published values; the
figure claims only the direction of the relationship the two studies report. Drawn from
Dziri et al. (2023) and Press et al. (2023).</figcaption>
</figure>

<div class="tenet">
<p class="label">What the evidence supports</p>
<p>That a single forward pass is bounded in serial depth, that generating intermediate tokens
buys additional depth in a quantity that has been characterised exactly for idealised models,
and that measured accuracy on compositional tasks falls as the number of composed steps
rises.</p>
<p class="label" style="margin-top:14px">What it does not</p>
<p>That any particular decomposition of a coding task is optimal, that the complexity classes
describe a deployed model, or that a longer chain of intermediate tokens is monotonically
better in practice.</p>
</div>

## The context as a data structure

The context window behaves as a store with non-uniform access cost rather than as an array
with uniform access, and this is measurable. Liu et al. (2024) evaluated retrieval from long
inputs and found that accuracy is highest when the relevant material appears at the beginning
or the end of the context and falls when it appears in the middle. The consequence is that
position carries cost in the way that cache locality carries cost, so the ordering of material
is a design decision rather than a formatting one (Liu et al., 2024). The corresponding
external structure is the file system, which functions as memory that survives the window and
can be written to deliberately. A result computed once and written to a file is the
memoisation of an expensive call, and re-deriving it in a later turn is the recomputation
that memoisation exists to avoid. Xia et al. (2025) rely on exactly this arrangement, since
their pipeline carries state between phases rather than holding it in one conversation. In sum, the ordinary cost model of a memory hierarchy applies to
an agent context, because access is neither free nor uniform.

<figure>
<svg class="dg" viewBox="0 0 620 210" role="img" aria-labelledby="ttl-ctx">
<title id="ttl-ctx">Retrieval accuracy against the position of the relevant material</title>
<path class="rule" d="M 70 30 L 70 150 L 560 150"/>
<text class="tf" x="20" y="34">accuracy</text>
<path class="band" d="M 70 46 L 150 88 L 240 116 L 315 122 L 390 112 L 480 78 L 560 44 L 560 150 L 70 150 Z"/>
<path class="plot" d="M 70 46 L 150 88 L 240 116 L 315 122 L 390 112 L 480 78 L 560 44"/>
<text class="tf" x="70" y="168">start of context</text>
<text class="tf" x="315" y="168" text-anchor="middle">middle</text>
<text class="tf" x="560" y="168" text-anchor="end">end of context</text>
<text class="tm" x="315" y="106" text-anchor="middle">lowest recovery</text>
<text class="tf" x="20" y="196">the curve is schematic and represents the reported shape rather than published values</text>
</svg>
<figcaption><span class="label">Figure 3</span> The reported shape of retrieval accuracy as
a function of where the relevant material sits in a long input. The figure represents the
direction and shape of the effect only and carries no published values; the effect was
measured on retrieval-style question answering rather than on code editing. Drawn from Liu et
al. (2024).</figcaption>
</figure>

## The algorithms already in use

Several established prompting techniques are named algorithms applied to a stochastic
generator, and reading them that way makes their cost and failure modes legible. Wang et al.
(2023) sample several independent chains and take the majority answer, which is
repeat-and-vote amplification of a randomised procedure, and it buys accuracy at a cost
linear in the number of samples (Wang et al., 2023). Yao et al. (2023) generalise the chain into a tree of
intermediate states with explicit breadth-first and depth-first exploration and a value
function over states, which is search rather than generation (Yao et al., 2023). The framing is useful because
it names the parameters: a search needs a branching factor, a depth bound, an evaluation
function and a stopping rule, and a prompt that asks for exploration without supplying them
has specified a search with none of its bounds. It can then be said that the technique
literature is largely algorithmic in content, because each of these methods is a familiar
strategy with a sampler in place of a deterministic step.

## The asymmetry between producing and checking

Producing a correct patch and checking one are tasks of very different cost, and the practical
consequence is that the cheap half should carry the weight. Xia et al. (2025) built a fixed
pipeline whose final phase is patch validation rather than further generation, and reported
that it outperformed the autonomous agents of the time on the same benchmark. The audit
literature supplies the reason to make the check real, because Aleithan et al. (2024) found
that 31.08 per cent of patches passing a widely used benchmark did so against tests too weak
to distinguish a correct patch from an incorrect one. The extrapolation is that a prompt
should spend its budget on specifying the acceptance check rather than on describing the
desired output, because the check is the half that can be made deterministic (Aleithan et
al., 2024; Xia et al., 2025). Consequently,
the useful question about an agent task is what would falsify a wrong answer, because a task
without such a test is a search without a stopping rule.

## What the correspondence does not license

The correspondence has a boundary and it should be stated plainly. The complexity results of
Merrill and Sabharwal (2023, 2024) concern model classes under explicit precision and
normalisation assumptions, and they establish what is representable rather than what a trained
model will do, so no result above implies that a given decomposition will succeed. The
empirical decay reported by Dziri et al. (2023) was measured on synthetic compositional tasks
rather than on repository editing, and the positional effect reported by Liu et al. (2024) was
measured on retrieval question answering. Ergo, the defensible claim is that decomposition,
ordering, caching and checking are the right categories to think in, and not that any
particular instance of them has been validated for coding work.

## Conclusion

It was first established that a single forward pass is a bounded-depth parallel computation
which sits inside uniform TC0 for log-precision models, and that this limits composition
rather than difficulty. Next, intermediate generation was presented as the resource that lifts
the ceiling, with logarithmic steps adding little, linear steps adding the regular languages,
and polynomial steps characterising exactly the polynomial-time solvable problems. It was then
shown that measured accuracy falls as compositional depth rises, and that models answer
sub-questions correctly while failing to compose them. Finally, the data-structure half was
set out — non-uniform access cost across the context, the file system as external memory,
sampling as randomised search, and checking as the cheap half of an asymmetric pair — together
with the boundary of the correspondence. A common thread running through these results is that
the quantity a prompt manipulates is serial steps and their ordering, rather than emphasis or
tone, because every result above is stated in terms of steps, positions and costs. As a next
step, a practitioner should take one task their agent reliably fails and count the dependent
steps it requires, because that count is the first quantity the literature above says will
matter.

## References

<ol class="refs">
<li>Aleithan, R., Xue, H., Mohajer, M. M., Nnorom, E., Uddin, G., &amp; Wang, S. (2024). SWE-Bench+: enhanced coding benchmark for LLMs. <a href="https://arxiv.org/abs/2410.06992">arXiv:2410.06992</a>.</li>
<li>Dziri, N., Lu, X., Sclar, M., Li, X. L., Jiang, L., Lin, B. Y., Welleck, S., West, P., Bhagavatula, C., Le Bras, R., Hwang, J. D., Sanyal, S., Ren, X., Ettinger, A., Harchaoui, Z., &amp; Choi, Y. (2023). Faith and fate: limits of transformers on compositionality. <em>Advances in Neural Information Processing Systems 36</em>. <a href="https://arxiv.org/abs/2305.18654">arXiv:2305.18654</a>.</li>
<li>Liu, N. F., Lin, K., Hewitt, J., Paranjape, A., Bevilacqua, M., Petroni, F., &amp; Liang, P. (2024). Lost in the middle: how language models use long contexts. <em>Transactions of the Association for Computational Linguistics</em>, 12, 157-173.</li>
<li>Merrill, W., &amp; Sabharwal, A. (2023). The parallelism tradeoff: limitations of log-precision transformers. <em>Transactions of the Association for Computational Linguistics</em>, 11, 531-545.</li>
<li>Merrill, W., &amp; Sabharwal, A. (2024). The expressive power of transformers with chain of thought. <em>International Conference on Learning Representations</em>. <a href="https://arxiv.org/abs/2310.07923">arXiv:2310.07923</a>.</li>
<li>Press, O., Zhang, M., Min, S., Schmidt, L., Smith, N. A., &amp; Lewis, M. (2023). Measuring and narrowing the compositionality gap in language models. <em>Findings of the Association for Computational Linguistics: EMNLP 2023</em>.</li>
<li>Wang, X., Wei, J., Schuurmans, D., Le, Q., Chi, E. H., Narang, S., Chowdhery, A., &amp; Zhou, D. (2023). Self-consistency improves chain of thought reasoning in language models. <em>International Conference on Learning Representations</em>. <a href="https://arxiv.org/abs/2203.11171">arXiv:2203.11171</a>.</li>
<li>Xia, C. S., Deng, Y., Dunn, S., &amp; Zhang, L. (2025). Demystifying LLM-based software engineering agents. <em>Proceedings of the ACM on Software Engineering</em>. <a href="https://arxiv.org/abs/2407.01489">arXiv:2407.01489</a>.</li>
<li>Yao, S., Yu, D., Zhao, J., Shafran, I., Griffiths, T. L., Cao, Y., &amp; Narasimhan, K. (2023). Tree of thoughts: deliberate problem solving with large language models. <em>Advances in Neural Information Processing Systems 36</em>. <a href="https://arxiv.org/abs/2305.10601">arXiv:2305.10601</a>.</li>
</ol>
