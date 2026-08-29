---
title: "Agentic Coding x Software Architecture pt. 1: Scoping the Task"
description: "How to decide what a single agent task should cover, drawn from what the software-architecture literature established about modular decomposition, change propagation, and the design metrics that fail to predict maintenance effort."
pubDate: 2026-08-29
tags: ["software architecture", "prompting", "agents"]
series:
  name: "Agentic Coding x Software Architecture"
  part: 1
---

The following discussion maintains that the software-architecture literature supports a
specific and well-replicated set of recommendations about how a single agentic coding task
should be scoped, and that the popular inference drawn from that literature — that a
codebase scoring well on design-quality metrics is thereby easier for an agent to change —
is not supported by the evidence. It will be shown that Parnas (1972) fixed the criterion
for decomposition as the anticipated change rather than the processing step. The cost of a
decomposition was located in the content of its interfaces rather than in the number or size
of its modules (Parnas, 1972). Next, it will be argued that this criterion was given an operational,
system-scale measurement in the propagation cost of MacCormack, Rusnak and Baldwin (2006),
a measure that separates cleanly from raw dependency counts and behaves in the opposite
direction to them. It will then be argued that the design-quality indicators practitioners
actually reach for do not survive a control for file size and change frequency, because
Sjøberg et al. (2013) and El Emam et al. (2001) removed the apparent effect in two
independent designs. Lastly, a scoping block for an agent task will be constructed in full,
together with the division between what belongs in the task statement and what belongs in a
standing constraint, and a checklist to run against a task before dispatching it. It should
be noted at the outset that none of the architecture studies cited here was conducted on a
coding agent, and that every prompting recommendation below is therefore an extrapolation,
marked as such where it appears.

## The criterion Parnas fixed for a decomposition

A module in the sense established by Parnas is a unit of concealed design decision rather
than a unit of processing, and that distinction is prescriptive about where a decomposition
is permitted to start. Parnas (1972) argues that modularisation should not begin from a
flowchart of processing steps but from an enumerated list of the design decisions that are
difficult or likely to change, with each module designed to hide exactly one of them.
The demonstration is carried out on a small indexing system, for which Parnas (1972)
enumerates five anticipated changes and traces each through two competing decompositions.
Under the processing-step decomposition, altering the decision to hold lines in core
reaches nearly every module in the system. Under the decomposition organised around hidden
decisions, the same change is confined to the one module that owns it (Parnas, 1972). Figure 1 sets out both decompositions with a single
change traced through each. In sum, the criterion is not that a system should have many
modules or small ones, but that the boundaries should fall where the anticipated changes
fall, because a boundary drawn anywhere else does not contain a change.

<figure>
<svg class="dg" viewBox="0 0 620 322" role="img" aria-labelledby="ttl-kwic">
<title id="ttl-kwic">One change traced through two decompositions of the same system</title>
<text class="tf" x="20" y="22">Decomposition by processing step</text>
<text class="tf" x="340" y="22">Decomposition by hidden decision</text>
<text class="tm" x="20" y="46">Change: line storage moves out of core</text>
<text class="tm" x="340" y="46">The same change</text>
<rect class="hot" x="20" y="76" width="260" height="30"/>
<rect class="hot" x="20" y="114" width="260" height="30"/>
<rect class="hot" x="20" y="152" width="260" height="30"/>
<rect class="hot" x="20" y="190" width="260" height="30"/>
<rect class="box" x="20" y="228" width="260" height="30"/>
<text class="tr" x="150" y="96" text-anchor="middle">Input</text>
<text class="tr" x="150" y="134" text-anchor="middle">Circular shift</text>
<text class="tr" x="150" y="172" text-anchor="middle">Alphabetize</text>
<text class="tr" x="150" y="210" text-anchor="middle">Output</text>
<text class="t" x="150" y="248" text-anchor="middle">Master control</text>
<rect class="hot" x="340" y="76" width="260" height="30"/>
<rect class="box" x="340" y="114" width="260" height="30"/>
<rect class="box" x="340" y="152" width="260" height="30"/>
<rect class="box" x="340" y="190" width="260" height="30"/>
<rect class="box" x="340" y="228" width="260" height="30"/>
<rect class="box" x="340" y="266" width="260" height="30"/>
<text class="tr" x="470" y="96" text-anchor="middle">Line storage</text>
<text class="t" x="470" y="134" text-anchor="middle">Input</text>
<text class="t" x="470" y="172" text-anchor="middle">Circular shifter</text>
<text class="t" x="470" y="210" text-anchor="middle">Alphabetizer</text>
<text class="t" x="470" y="248" text-anchor="middle">Output</text>
<text class="t" x="470" y="286" text-anchor="middle">Master control</text>
<text class="tf" x="20" y="282">4 of 5 modules touched</text>
<text class="tf" x="340" y="316">1 of 6 modules touched</text>
</svg>
<figcaption><span class="label">Figure 1</span> The same anticipated change — moving line
storage out of core — traced through two decompositions of Parnas's indexing example, with
the modules it reaches shown filled. The figure depicts the reach of one change only; it
does not claim that the right-hand decomposition is better on any other dimension, and
Parnas states the comprehensibility advantage of information hiding as a judgement rather
than as a measured result. Drawn from Parnas (1972).</figcaption>
</figure>

The property that determines whether two pieces of work can proceed independently is the
content of the interface between them, not the count or the size of the modules on either
side. Parnas (1972) observes that the processing-step decomposition makes its interfaces out of
shared representations, namely table formats and core layouts, which have to be designed
jointly before either side can begin. In the decision-hiding decomposition the interfaces are
small procedural contracts that can be agreed once and then left alone (Parnas, 1972).
It must be noted that Parnas (1972) also separates two properties that are frequently run
together. Hierarchical layering under a "uses" relation and decomposition by hidden decision
are independent of one another, so a system can be cleanly layered and still expose its most
volatile decisions in its interfaces (Parnas, 1972). Consequently, the useful question about a boundary is
what a party on either side of it must know, because an interface that requires knowledge
of a volatile decision has not hidden that decision at all.

## The system-scale measurement of a decomposition

Propagation cost gives Parnas's criterion an operational measure at the scale of a whole
system, and the measure behaves differently from the dependency counts it is often confused
with. MacCormack, Rusnak and Baldwin (2006) define propagation cost as the average
proportion of a system's source files that a change to one file could reach through direct
or indirect dependencies, computed over the transitive closure of a file-level dependency
matrix. Applied to two systems of comparable size, the measure separates them by a factor
of roughly three. MacCormack, Rusnak and Baldwin (2006) report that Linux carried over forty
per cent more dependencies per thousand file pairs than Mozilla, 3.4 against 2.4. Its
propagation cost was nonetheless around a third of Mozilla's (MacCormack, Rusnak & Baldwin,
2006). The same authors report a
longitudinal case in which a deliberate redesign of Mozilla cut propagation cost from 17.35
per cent to 2.78 per cent while roughly halving the raw dependency count, from 6,717 to
3,037 (MacCormack, Rusnak & Baldwin, 2006). Figure 2 sets the three states side by side.
Accordingly, dependency density is not a proxy for how far a change travels, because the
two moved in opposite directions in the one case where both were measured.

<figure>
<svg class="dg" viewBox="0 0 620 254" role="img" aria-labelledby="ttl-pc">
<title id="ttl-pc">Dependency density and propagation cost move independently</title>
<text class="tf" x="20" y="22">Linux</text>
<text class="tf" x="230" y="22">Mozilla, before redesign</text>
<text class="tf" x="440" y="22">Mozilla, after redesign</text>
<rect class="box" x="20" y="36" width="140" height="140"/>
<rect class="box" x="230" y="36" width="140" height="140"/>
<rect class="box" x="440" y="36" width="140" height="140"/>
<path class="rule" d="M 20 36 L 160 176"/>
<path class="rule" d="M 230 36 L 370 176"/>
<path class="rule" d="M 440 36 L 580 176"/>
<rect class="fill" x="24" y="40" width="44" height="44"/>
<rect class="fill" x="72" y="88" width="40" height="40"/>
<rect class="fill" x="116" y="132" width="40" height="40"/>
<rect class="hot" x="24" y="88" width="6" height="6"/>
<rect class="hot" x="40" y="132" width="6" height="6"/>
<rect class="hot" x="128" y="52" width="6" height="6"/>
<rect class="hot" x="96" y="64" width="6" height="6"/>
<rect class="fill" x="234" y="40" width="44" height="44"/>
<rect class="fill" x="282" y="88" width="40" height="40"/>
<rect class="fill" x="326" y="132" width="40" height="40"/>
<rect class="hot" x="234" y="96" width="6" height="6"/>
<rect class="hot" x="246" y="140" width="6" height="6"/>
<rect class="hot" x="338" y="48" width="6" height="6"/>
<rect class="hot" x="306" y="56" width="6" height="6"/>
<rect class="hot" x="352" y="64" width="6" height="6"/>
<rect class="hot" x="290" y="152" width="6" height="6"/>
<rect class="hot" x="262" y="120" width="6" height="6"/>
<rect class="hot" x="318" y="100" width="6" height="6"/>
<rect class="fill" x="444" y="40" width="44" height="44"/>
<rect class="fill" x="492" y="88" width="40" height="40"/>
<rect class="fill" x="536" y="132" width="40" height="40"/>
<rect class="hot" x="470" y="96" width="6" height="6"/>
<rect class="hot" x="548" y="60" width="6" height="6"/>
<text class="tm" x="20" y="200">3.4 deps / 1000 pairs</text>
<text class="tm" x="230" y="200">2.4 deps / 1000 pairs</text>
<text class="tm" x="440" y="200">1.3 deps / 1000 pairs</text>
<text class="tf" x="20" y="222">propagation cost</text>
<text class="tf" x="230" y="222">propagation cost</text>
<text class="tf" x="440" y="222">propagation cost</text>
<text class="t" x="20" y="242">about a third of Mozilla's</text>
<text class="t" x="230" y="242">17.35%</text>
<text class="t" x="440" y="242">2.78%</text>
</svg>
<figcaption><span class="label">Figure 2</span> Schematic dependency matrices for the three
systems measured by MacCormack, Rusnak and Baldwin (2006), with the reported dependency
density and propagation cost beneath each. The matrices are illustrative rather than
reproductions, and the figure claims only that density and propagation cost moved
independently in these measurements; the Linux propagation cost is given as the ratio the
authors report rather than as an absolute figure. Drawn from MacCormack, Rusnak and Baldwin
(2006).</figcaption>
</figure>

The strength of this result should be read as exploratory rather than established, and the
authors mark it as such. MacCormack, Rusnak and Baldwin (2006) rest the comparison on two
systems cross-sectionally plus one longitudinal case, which is a design that can support a
claim about those systems but not the wider organisational claim that distributed
development produces more modular architectures. It must be noted that propagation cost is
defined over the dependency graph and nothing else. A system can therefore lower it without
becoming cheaper to maintain, and the studies reviewed in the next section show that reach
and effort have to be measured separately. Therefore propagation cost should be
treated as a bound on how far a change can travel rather than as a measure of
maintainability, because nothing in its definition refers to the cost of making a change.

## The design indicators that do not survive a control for size

The design-quality indicators that practitioners reach for do not predict maintenance
effort once file size and change frequency are held constant, and this has been shown in
designs strong enough to bear the weight. Sjøberg et al. (2013) ran a controlled field
experiment in which six hired professional developers each performed three maintenance
tasks across four functionally equivalent Java systems, modifying 298 files, and found that
none of the twelve code smells investigated was significantly associated with increased
maintenance effort once file size and number of changes were statistically controlled.
The same study reports that one smell, Refused Bequest, was associated with a decrease in
effort, which is an effect in the opposite direction to the folklore (Sjøberg et al., 2013).
The pattern is not confined to smells. El Emam et al. (2001) demonstrated that class size
confounds the validation of object-oriented design metrics, reproducing the standard positive
result for the Chidamber and Kemerer suite when size is left uncontrolled. Controlling for it
changed which metrics remained validated predictors (El Emam et al., 2001). Figure 3 sets out the structure of that confound.
In sum, size and change history carry the predictive weight that design indicators are
usually credited with, because the indicators lose significance precisely when those two
variables are entered.

<figure>
<svg class="dg" viewBox="0 0 620 218" role="img" aria-labelledby="ttl-conf">
<title id="ttl-conf">Size and change count as a confound between design indicators and effort</title>
<rect class="box" x="20" y="76" width="150" height="46"/>
<text class="t" x="95" y="96" text-anchor="middle">design indicator</text>
<text class="tm" x="95" y="112" text-anchor="middle">smell, CK metric</text>
<rect class="fill" x="235" y="16" width="150" height="46"/>
<text class="t" x="310" y="36" text-anchor="middle">file size</text>
<text class="t" x="310" y="52" text-anchor="middle">number of changes</text>
<rect class="box" x="450" y="76" width="150" height="46"/>
<text class="t" x="525" y="102" text-anchor="middle">maintenance effort</text>
<path class="dash" d="M 170 99 L 444 99"/>
<polygon class="arrow" points="450,99 439,95 439,103"/>
<text class="tf" x="307" y="92" text-anchor="middle">not significant once conditioned</text>
<path class="line" d="M 235 46 C 150 46, 110 56, 100 70"/>
<polygon class="arrow" points="95,76 105,70 108,77"/>
<path class="line" d="M 385 46 C 470 46, 510 56, 520 70"/>
<polygon class="arrow" points="525,76 512,77 515,70"/>
<text class="tf" x="20" y="160">Uncontrolled</text>
<text class="tm" x="20" y="180">the indicator appears to predict effort</text>
<text class="tf" x="340" y="160">Controlled for size and changes</text>
<text class="tm" x="340" y="180">no smell of twelve remained significant</text>
<path class="rule" d="M 20 196 L 600 196"/>
<text class="tf" x="20" y="212">Sjoberg et al. (2013), 298 files, six professional developers</text>
</svg>
<figcaption><span class="label">Figure 3</span> The confound structure common to the code
smell and object-oriented metric literatures: the apparent path from a design indicator to
maintenance effort does not survive conditioning on file size and change count. The figure
states a statistical relationship and does not claim that design indicators are meaningless,
only that they carry no independent predictive weight in the studies shown. Drawn from
Sjøberg et al. (2013) and El Emam et al. (2001).</figcaption>
</figure>

The strongest objection to this reading is that controlling for size removes real signal
along with the confound, and it has a named proponent. Evanco (2003) published a comment
disputing El Emam and colleagues' statistical treatment, arguing that size is not a mere
nuisance variable but part of the causal path from design to fault-proneness, so that
conditioning on it discards genuine explanatory power. That objection has force where the
outcome is fault-proneness, and Basili, Briand and Melo (1996) had earlier found five of
the six Chidamber and Kemerer metrics to be significant predictors of whether a class would
have a fault, with the cohesion metric LCOM detecting nothing and the number-of-children
metric significant in the direction opposite to the hypothesis. It has much less force
against Sjøberg et al. (2013), because that study measured effort directly on professional
developers rather than inferring quality from defect counts, and it controlled for change
count as well as size. Accordingly, the defensible summary is that design indicators retain
some association with defects and lose their association with effort, because the two
outcomes have been measured separately and behave differently.

## The scoping of an agent task

Everything in this section is an extrapolation from the results above to a setting none of
them examined, and should be treated as a hypothesis rather than a finding.

### The anticipated change as the unit of a task

A task given to an agent should be stated as the change to be absorbed rather than as the
sequence of steps to be performed, which is Parnas's criterion transposed. Parnas (1972)
locates the failure of the processing-step decomposition in the fact that the steps are not
the things that vary. The same reasoning applies to a task statement built as a procedure,
because a procedure fixes a path through the system in advance. When the path is wrong the
agent has to be corrected out of it, which is work the task itself created. The practical form is to name the decision that is
changing and the module that owns it, and to leave the route open.

| Written as a procedure | Written as an anticipated change |
| --- | --- |
| Open `store.py`, add a `redis` branch to `get`, then update the three callers | The cache backend is becoming configurable; `store.py` owns that decision and should be the only file that knows which backend is in use |
| Add a `timeout` parameter to every function in `client/` | Request deadlines are becoming caller-specified; `client/session.py` owns the deadline policy |

### The interface as the boundary of the context

The set of files handed to an agent should be drawn at an interface whose content the task
does not change, because that is the boundary Parnas identifies as the one across which
work can proceed independently. Parnas (1972) shows that a boundary requiring both sides to
agree on a shared representation is not a boundary at all. The corresponding failure in an
agent context is supplying a module together with three of its callers when the calling
convention is itself in scope. Where the interface is genuinely stable, the callers can be
described rather than supplied; where it is not, the task has been scoped across a boundary
that does not exist and should be restated.

### The material that belongs in a standing constraint

A property that holds across every task belongs in the instruction file rather than in the
task, and the distinction is the same one that separates a hidden decision from an
interface. A convention about error types, a rule about which layer may perform input or
output, and a prohibition on reaching past a module boundary are all standing constraints,
because they do not vary with the change being made. A statement of which decision is
moving, which files own it, and what the acceptance condition is belongs in the task,
because it varies with every one.

### A worked scoping block

<figure>
<svg class="dg" viewBox="0 0 620 268" role="img" aria-labelledby="ttl-scope">
<title id="ttl-scope">The anatomy of a scoped agent task</title>
<rect class="box" x="20" y="16" width="580" height="52"/>
<text class="tf" x="34" y="36">The change</text>
<text class="t" x="34" y="56">the decision that is moving, named, not the steps to move it</text>
<rect class="box" x="20" y="76" width="580" height="52"/>
<text class="tf" x="34" y="96">The owner</text>
<text class="t" x="34" y="116">the file or module that hides the decision, and is the only one to change</text>
<rect class="box" x="20" y="136" width="580" height="52"/>
<text class="tf" x="34" y="156">The boundary</text>
<text class="t" x="34" y="176">the interface held fixed, stated so the agent knows what it may not alter</text>
<rect class="fill" x="20" y="196" width="580" height="52"/>
<text class="tf" x="34" y="216">The acceptance condition</text>
<text class="t" x="34" y="236">the check that decides the task, written before the work begins</text>
<text class="tf" x="20" y="264">standing conventions live in the instruction file and are deliberately absent here</text>
</svg>
<figcaption><span class="label">Figure 4</span> The four parts of a task statement scoped
to a module boundary, with standing conventions deliberately excluded because they do not
vary with the change. The figure is a proposed structure extrapolated from Parnas (1972)
and is not drawn from any study of agent behaviour.</figcaption>
</figure>

```markdown
## Task

Change: the cache backend becomes configurable at startup. Today it is
hard-coded to the in-process dict in `store.py`.

Owner: `store.py`. It is the only file that should learn which backend is
in use. If a second file needs to know, stop and say so.

Boundary held fixed: the `Store` protocol in `store.py` — `get`, `set`,
`invalidate`. Callers in `api/` and `workers/` are described below and
are not in scope. Do not change their call sites.

Callers, for reference only:
  api/handlers.py     calls get and set, never invalidate
  workers/refresh.py  calls invalidate on a timer

Acceptance: `pytest tests/test_store.py` passes with both backends
selected via `CACHE_BACKEND`, and `git diff --stat` shows changes only
in `store.py` and its test.
```

### A checklist for a scoped task

1. The task names a decision that is changing, not a sequence of edits.
2. Exactly one file or module is named as the owner of that decision.
3. The interface being held fixed is stated, and the task does not change it.
4. Files outside the boundary are described rather than supplied.
5. The acceptance condition is a command with an observable result, written before the work.
6. Nothing in the block would be true of every task; anything that would has been moved to
   the instruction file.

## Conclusion

It was first established that Parnas fixed the criterion for decomposition as the
anticipated change rather than the processing step, and located the cost of a boundary in
what its interface obliges each side to know. Next, propagation cost was presented as the
operational, system-scale form of that criterion, together with the finding that it moves
independently of raw dependency density and the authors' own marking of the study as
exploratory. It was then shown that the design indicators practitioners reach for lose
their association with maintenance effort once file size and change count are controlled,
and that the strongest objection to this reading, from Evanco (2003), bears on fault
prediction rather than on effort. Finally, a scoping block was constructed in full, the
division between task and standing constraint was set out, and a checklist was given, all
of it marked as extrapolation. A common thread running through these findings is that the
quantity which predicts trouble is reach, meaning how far a change can travel, rather than
any static property of the code it travels through. A task scoped to a boundary is a way of
bounding reach before the work starts. As a next step, each recommendation above should be
treated as a hypothesis to test against a practitioner's own repository, because the
studies cited measured human maintainers on systems that no agent was involved in building.

[The second note in this series](/blog/retrieval-co-change-and-context-assembly/) takes up
which files should actually be handed to an agent, and what the retrieval evidence says
about how badly that step currently goes.

## References

<ol class="refs">
<li>Basili, V. R., Briand, L. C., &amp; Melo, W. L. (1996). A validation of object-oriented design metrics as quality indicators. <em>IEEE Transactions on Software Engineering</em>, 22(10), 751-761.</li>
<li>El Emam, K., Benlarbi, S., Goel, N., &amp; Rai, S. N. (2001). The confounding effect of class size on the validity of object-oriented metrics. <em>IEEE Transactions on Software Engineering</em>, 27(7), 630-650.</li>
<li>Evanco, W. M. (2003). Comments on "The confounding effect of class size on the validity of object-oriented metrics". <em>IEEE Transactions on Software Engineering</em>, 29(7), 670-672.</li>
<li>MacCormack, A., Rusnak, J., &amp; Baldwin, C. Y. (2006). Exploring the structure of complex software designs: an empirical study of open source and proprietary code. <em>Management Science</em>, 52(7), 1015-1030.</li>
<li>Parnas, D. L. (1972). On the criteria to be used in decomposing systems into modules. <em>Communications of the ACM</em>, 15(12), 1053-1058.</li>
<li>Sjøberg, D. I. K., Yamashita, A., Anda, B. C. D., Mockus, A., &amp; Dybå, T. (2013). Quantifying the effect of code smells on maintenance effort. <em>IEEE Transactions on Software Engineering</em>, 39(8), 1144-1156.</li>
</ol>
