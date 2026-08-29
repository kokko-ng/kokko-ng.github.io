---
title: "Agentic Coding x Software Architecture pt. 3: Decisions and Verification"
description: "What to write down for an agent to read, why architectural decisions rather than code smells are where the cost sits, and why a passing test suite is weaker evidence of a correct patch than it appears."
pubDate: 2026-08-29
tags: ["software architecture", "prompting", "agents"]
series:
  name: "Agentic Coding x Software Architecture"
  part: 3
---

LaToza, Venolia and DeLine (2006) found that understanding why existing code is the way it
is was the difficulty engineers rated most highly, and that the documents meant to record
it were described as write-only. That finding sets the shape of this discussion, which
maintains that the information an agent most needs about a codebase is the rationale
behind its structure, that this is precisely the information least often written down, and
that the verification step most practitioners rely on has been measured and found much
weaker than it appears. It will be shown that
understanding the reasoning behind existing code is the highest-rated difficulty developers
report, and that design documents are largely not consulted when they need it. Next, it will
be argued that the cost of poor structure concentrates in architectural decisions and in
small clusters of connected files, rather than being distributed across the code-level
indicators that tooling reports. It will then be argued that the severity rankings such
tooling assigns do not track measured harm, because two large studies found the rules
labelled as defects to carry essentially no fault-prediction power. Lastly, the validity of
benchmark-based evidence about coding agents will be examined, and an instruction-file format
and a verification protocol will be constructed in full. It should be noted at the outset
that the architecture studies cited here were conducted on human maintainers, that the agent
studies are benchmark evaluations, and that every recommendation below is an extrapolation,
marked as such where it appears.

## The information developers report needing and lacking

Understanding why existing code is the way it is is the difficulty developers rate most
highly, and it is not addressed by the artefacts intended to address it. LaToza, Venolia and
DeLine (2006) surveyed a random sample of a thousand engineers at a large software company,
receiving 157 responses, and found that understanding the rationale behind code was the
single highest-rated problem, called serious by 66 per cent of respondents. The same survey
found change impact close behind, with 61 per cent rating awareness of changes elsewhere that
affect their code a serious problem and 55 per cent rating understanding the impact of their
own changes elsewhere a serious problem (LaToza, Venolia & DeLine, 2006). When developers
investigate code they go to the artefacts rather than to prose, spending on average 42 per
cent of understanding time reading source, 20 per cent in the debugger and 16 per cent
reading check-in comments (LaToza, Venolia & DeLine, 2006). Figure 1 presents that distribution. In sum, the need is for rationale and for change impact, because those are the
two things the people who already know the system still report not having.

<figure>
<svg class="dg" viewBox="0 0 620 252" role="img" aria-labelledby="ttl-latoza">
<title id="ttl-latoza">Reported difficulty and where understanding time is spent</title>
<text class="tf" x="20" y="20">Rated a serious problem</text>
<rect class="hot" x="250" y="30" width="264" height="24"/>
<rect class="hot" x="250" y="62" width="244" height="24"/>
<rect class="hot" x="250" y="94" width="220" height="24"/>
<text class="tm" x="240" y="47" text-anchor="end">understanding rationale behind code</text>
<text class="tm" x="240" y="79" text-anchor="end">awareness of changes elsewhere</text>
<text class="tm" x="240" y="111" text-anchor="end">impact of my changes elsewhere</text>
<text class="t" x="524" y="47">66%</text>
<text class="t" x="504" y="79">61%</text>
<text class="t" x="480" y="111">55%</text>
<path class="rule" d="M 20 138 L 600 138"/>
<text class="tf" x="20" y="162">Where understanding time goes</text>
<rect class="fill" x="20" y="174" width="244" height="26"/>
<rect class="box" x="264" y="174" width="116" height="26"/>
<rect class="box" x="380" y="174" width="93" height="26"/>
<rect class="box" x="473" y="174" width="127" height="26"/>
<text class="t" x="142" y="191" text-anchor="middle">source code, 42%</text>
<text class="t" x="322" y="191" text-anchor="middle">debugger, 20%</text>
<text class="tm" x="426" y="191" text-anchor="middle">check-ins, 16%</text>
<text class="tm" x="536" y="191" text-anchor="middle">everything else</text>
<text class="tf" x="20" y="226">design documents were described as seldom re-read and almost never current</text>
<text class="tf" x="20" y="244">percentages of understanding time are means with wide reported variation</text>
</svg>
<figcaption><span class="label">Figure 1</span> The problems engineers rated serious and the
distribution of their code-understanding time, from a survey of 157 respondents at one large
software company. The time percentages carry large standard deviations in the source and the
figure does not claim they are stable across organisations. Drawn from LaToza, Venolia and
DeLine (2006).</figcaption>
</figure>

The absence of written rationale is a documented property of practice rather than an
accusation. LaToza, Venolia and DeLine (2006) report that interviewees described design
documents as write-only artefacts, seldom re-read and almost never kept current, and hard to
locate in the first place. Tang, Babar, Gorton and Han (2005) surveyed practitioners
specifically on design rationale and found the same shortfall between the value placed on it
and the extent to which it is recorded. Jansen and Bosch (2005) responded by proposing that
an architecture be treated as a set of design decisions rather than as a set of components,
which is a reframing intended to make rationale a first-class artefact. Consequently, an
instruction file that records why a boundary exists supplies exactly the information the
literature identifies as scarce, because the code itself records the what and not the why.

## The concentration of cost in decisions and clusters

The cost attributed to poor structure concentrates in architectural decisions and in small
groups of connected files, rather than spreading evenly across code-level indicators. Ernst
et al. (2015) surveyed 1,831 practitioners working on long-lived software at three large
organisations and found that architectural decisions were identified as the most important
source of technical debt. Kazman et al. (2015) established the structural counterpart,
showing that defect-prone files are not scattered independently but cluster into
architecturally connected groups whose connecting structures carry the flaw. Those clusters
are locatable from routinely available data, because Xiao, Cai and Kazman (2014) construct
them by combining structural dependencies with evolutionary co-change as first-class
relations, using revision history and issue-tracker records. The difference between the two pictures is shown in Figure 2. Accordingly, the useful unit of architectural attention
is a group of files linked by a shared flawed decision, because that is the unit in which the
measured defects actually arrive.

<figure>
<svg class="dg" viewBox="0 0 620 232" role="img" aria-labelledby="ttl-roots">
<title id="ttl-roots">Defect-prone files as scattered and as clustered</title>
<text class="tf" x="20" y="20">Assumed distribution</text>
<text class="tf" x="330" y="20">Measured distribution</text>
<rect class="box" x="20" y="32" width="250" height="150"/>
<rect class="box" x="330" y="32" width="250" height="150"/>
<rect class="hot" x="48" y="56" width="8" height="8"/>
<rect class="hot" x="112" y="84" width="8" height="8"/>
<rect class="hot" x="196" y="48" width="8" height="8"/>
<rect class="hot" x="72" y="140" width="8" height="8"/>
<rect class="hot" x="224" y="120" width="8" height="8"/>
<rect class="hot" x="160" y="156" width="8" height="8"/>
<rect class="hot" x="236" y="72" width="8" height="8"/>
<rect class="hot" x="96" y="108" width="8" height="8"/>
<rect class="fill" x="352" y="48" width="86" height="60"/>
<rect class="fill" x="470" y="106" width="86" height="60"/>
<rect class="hot" x="362" y="60" width="8" height="8"/>
<rect class="hot" x="382" y="76" width="8" height="8"/>
<rect class="hot" x="410" y="62" width="8" height="8"/>
<rect class="hot" x="396" y="92" width="8" height="8"/>
<rect class="hot" x="480" y="118" width="8" height="8"/>
<rect class="hot" x="504" y="140" width="8" height="8"/>
<rect class="hot" x="530" y="122" width="8" height="8"/>
<rect class="hot" x="514" y="152" width="8" height="8"/>
<path class="dash" d="M 438 78 L 470 136"/>
<text class="tf" x="352" y="42">root</text>
<text class="tf" x="470" y="100">root</text>
<text class="tm" x="20" y="204">defects treated as independent per-file events</text>
<text class="tm" x="330" y="204">defects arrive in connected groups</text>
<text class="tf" x="20" y="226">a root is the shared flawed structure connecting the files, not the files themselves</text>
</svg>
<figcaption><span class="label">Figure 2</span> The contrast between treating defect-prone
files as independently distributed and the measured clustering into architecturally connected
groups. The figure is schematic and reports no counts; the clustering claim is established on
a small number of studied projects rather than on a general sample. Drawn from Kazman et al.
(2015) and Xiao, Cai and Kazman (2014).</figcaption>
</figure>

## The severity rankings that do not track measured harm

The severity a static-analysis tool assigns to a finding is not evidence about that finding,
and this has now been measured twice at scale on the same tool. Lenarduzzi, Lomio, Huttunen
and Taibi (2020) analysed 21 mature Apache Java projects and around 39,518 commits, labelling
fault-inducing commits, and found that the violations the tool explicitly types as bugs were
introduced in only 374 of those commits. A classifier built on them achieved an area under
the curve of 50.95 per cent, which is indistinguishable from chance (Lenarduzzi et al.,
2020). In a companion study across 33 Apache projects, Lenarduzzi, Saarimäki and Taibi (2020)
found that for more than seventy per cent of debt items the measured change- and
fault-proneness did not increase with the assigned severity level, and that where differences
between clean and affected classes were statistically significant the effect sizes were
negligible. Figure 3 presents the assigned ranking against the measured one. The authors
recommend against the default rule set that more than ninety-eight per cent of public
projects use, in favour of per-project historical analysis (Lenarduzzi, Saarimäki & Taibi,
2020). Therefore a tool's own severity label should not be passed to an agent as a priority,
because the label has been shown not to predict the harm it names.

<figure>
<svg class="dg" viewBox="0 0 620 220" role="img" aria-labelledby="ttl-sev">
<title id="ttl-sev">Assigned severity against measured fault-proneness</title>
<text class="tf" x="20" y="20">Severity assigned by the tool</text>
<rect class="box" x="20" y="32" width="100" height="26"/>
<rect class="fill" x="128" y="32" width="100" height="26"/>
<rect class="fill" x="236" y="32" width="100" height="26"/>
<rect class="hot" x="344" y="32" width="100" height="26"/>
<rect class="hot" x="452" y="32" width="100" height="26"/>
<text class="tm" x="70" y="49" text-anchor="middle">Info</text>
<text class="t" x="178" y="49" text-anchor="middle">Minor</text>
<text class="t" x="286" y="49" text-anchor="middle">Major</text>
<text class="tr" x="394" y="49" text-anchor="middle">Critical</text>
<text class="tr" x="502" y="49" text-anchor="middle">Blocker</text>
<path class="line" d="M 286 66 L 286 92"/><polygon class="arrow" points="286,98 282,87 290,87"/>
<text class="tf" x="20" y="124">Measured change- and fault-proneness</text>
<path class="rule" d="M 20 136 L 600 136"/>
<path class="plot" d="M 70 158 L 178 152 L 286 160 L 394 150 L 502 156"/>
<text class="tm" x="20" y="186">no monotonic increase for more than 70% of debt items</text>
<text class="tf" x="20" y="210">effect sizes between affected and unaffected classes were negligible where significant</text>
</svg>
<figcaption><span class="label">Figure 3</span> The tool's ordered severity scale against
the measured fault- and change-proneness associated with each level. The plotted line is
schematic and represents the absence of a monotonic relationship reported by the authors
rather than their published values. Drawn from Lenarduzzi, Saarimäki and Taibi (2020).</figcaption>
</figure>

## The validity of benchmark evidence about agents

The benchmark scores that inform most claims about agentic coding overstate capability by a
measured factor, and the defect is in the benchmark rather than in the models. Aleithan et al.
(2024) audited the most widely used repository-level benchmark and found that 32.67 per cent
of the patches scored as successful had their solution stated directly in the issue report or
its comments. A further 31.08 per cent of passing patches were judged suspicious because the
tests were too weak to establish that the patch was correct (Aleithan et al., 2024). After
both categories were filtered out, the reported resolution rate for one widely cited agent
fell from 12.47 per cent to 3.97 per cent (Aleithan et al., 2024). Figure 4 shows the filtering. Aleithan et al. (2024) further report that over 94 per cent of the benchmark's
issues predate the evaluated models' knowledge cutoffs, and that the same defects are present
in the curated derivative sets. In sum, a passing test suite in this setting is weak evidence
of a correct patch, because in almost a third of passing cases the tests could not have
distinguished a correct patch from an incorrect one.

<figure>
<svg class="dg" viewBox="0 0 620 218" role="img" aria-labelledby="ttl-swe">
<title id="ttl-swe">Reported resolution rate before and after filtering invalid instances</title>
<text class="tf" x="20" y="20">Reported</text>
<rect class="hot" x="20" y="30" width="470" height="30"/>
<text class="tr" x="255" y="50" text-anchor="middle">12.47% resolution rate</text>
<text class="tf" x="20" y="86">Removed on audit</text>
<rect class="fill" x="20" y="96" width="230" height="26"/>
<rect class="fill" x="250" y="96" width="220" height="26"/>
<text class="t" x="135" y="113" text-anchor="middle">solution stated in the issue, 32.67%</text>
<text class="t" x="360" y="113" text-anchor="middle">tests too weak to verify, 31.08%</text>
<text class="tf" x="20" y="152">After filtering</text>
<rect class="hot" x="20" y="162" width="150" height="30"/>
<text class="tr" x="95" y="182" text-anchor="middle">3.97%</text>
<text class="tf" x="20" y="212">percentages of removed instances are shares of passing patches, not of the whole benchmark</text>
</svg>
<figcaption><span class="label">Figure 4</span> The audited resolution rate for one agent
before and after removing instances whose solution appeared in the issue text and instances
whose tests were too weak to verify a patch. The two removal categories overlap in the source
and the bars are not additive. Drawn from Aleithan et al. (2024).</figcaption>
</figure>

<div class="tenet">
<p class="label">What the evidence supports</p>
<p>That rationale and change impact are the information developers most report lacking, that
technical debt concentrates in architectural decisions and connected file clusters, that
tool-assigned severities do not track measured fault-proneness, and that benchmark resolution
rates fall by roughly two thirds under audit.</p>
<p class="label" style="margin-top:14px">What it does not</p>
<p>That writing rationale down improves agent performance, that any particular decision-record
format helps, or that the audit factor for one public benchmark transfers to a practitioner's
own repository.</p>
</div>

## The practice these results support

Everything in this section is an extrapolation to a setting the cited studies did not
examine, and should be treated as a hypothesis rather than a finding.

### The recording of a decision an agent will read

A decision record written for an agent should state the constraint that the decision imposes
on future code, because that is the part a model can act on. The rationale that LaToza,
Venolia and DeLine (2006) found developers lacking is historical and explanatory, whereas an
agent needs the same information in its operative form.

```markdown
## D-014 · The HTTP client is constructed once, in `net/pool.py`

Constraint: no module outside `net/` may construct a client, set a
timeout, or configure retries. Callers receive a session.

Because: connection pooling and the retry budget are global properties.
Two pools silently double the effective rate limit, which is how the
2026-03 incident happened.

Consequences: a caller needing a different timeout is a change to
`net/pool.py`, not a local override. If this rule is inconvenient in a
new context, stop and raise it rather than working around it.

Superseded by: nothing yet.
```

The three parts do different work. The constraint is checkable, the reason survives the
personnel change that Tang, Babar, Gorton and Han (2005) identify as the point at which
rationale is normally lost, and the consequence tells the agent what to do when the rule
binds.

### The material that does not belong in an instruction file

| Do not include | Because |
| --- | --- |
| Static-analysis severities as priorities | Assigned severity did not track measured fault-proneness (Lenarduzzi, Saarimäki & Taibi, 2020) |
| Code-smell lists as quality goals | No smell predicted maintenance effort once size and change count were controlled |
| A layering claim that is not currently true | The divergence is where the agent will be misled |
| Rationale written as history | The operative form is a constraint, not a narrative |

### The verification of an agent's patch

A passing test suite should be treated as a necessary condition rather than as evidence of
correctness, which is the direct reading of the audit result. Aleithan et al. (2024) found
that in 31.08 per cent of passing cases the tests could not distinguish a correct patch from
an incorrect one, and the same weakness is available in any repository whose tests were
written to cover the happy path.

1. Confirm the test that fails before the patch and passes after it exists, and was not
   written by the same agent in the same turn.
2. Confirm the diff touches only the files named as owners in the task.
3. Confirm every identifier and path in the agent's explanation exists in the tree.
4. Read the test rather than the patch, and ask what incorrect patch would also pass it.
5. Where the change crosses a decision record, confirm the record still holds or amend it in
   the same commit.

## What this review could not establish

Several questions that a practitioner would reasonably ask returned no verified finding, and
that absence should be read as an absence of evidence rather than as a negative result. No
study located here measures whether supplying architectural rationale to a coding agent
improves its output, whether any decision-record format outperforms another for that purpose,
or whether the microservice decomposition advice that dominates practitioner writing has
empirical support; on the last point, Soldani, Tamburri and van den Heuvel (2018) explicitly
characterise their review as a grey-literature review, which is to say a survey of
practitioner claims rather than of measured results. Each of these remains open.

## Conclusion

It was shown that rationale and change impact are the difficulties developers rate most
highly, and that the documents intended to supply them are described as seldom read and
rarely current. Next, the concentration of cost was presented, with architectural
decisions identified as the leading source of technical debt in a survey of 1,831
practitioners and defect-prone files shown to cluster into connected groups rather than
scatter. It was then shown that tool-assigned severities do not track measured harm, since a
classifier over the violations typed as bugs performed at chance. Finally, benchmark validity
was examined, the audited fall from 12.47 to 3.97 per cent was set out, and a decision-record
format and verification protocol were constructed and marked as extrapolation. A common
thread running through these findings is that the artefacts practitioners treat as evidence —
a severity label, a green test suite, a benchmark score — have each been measured and found
not to carry the meaning assigned to them, while the information that is genuinely scarce is
the reason a boundary exists. The cheapest available test is to write the constraint form of the three or four decisions
a codebase actually depends on, put them where the agent reads them, and record over the
following month which of them the agent breached and which it never needed, because that
is the one measurement here a practitioner can make without a benchmark.

## References

<ol class="refs">
<li>Aleithan, R., Xue, H., Mohajer, M. M., Nnorom, E., Uddin, G., &amp; Wang, S. (2024). SWE-Bench+: enhanced coding benchmark for LLMs. <a href="https://arxiv.org/abs/2410.06992">arXiv:2410.06992</a>.</li>
<li>Ernst, N. A., Bellomo, S., Ozkaya, I., Nord, R. L., &amp; Gorton, I. (2015). Measure it? Manage it? Ignore it? Software practitioners and technical debt. <em>Joint Meeting on Foundations of Software Engineering</em>, 50-60.</li>
<li>Jansen, A., &amp; Bosch, J. (2005). Software architecture as a set of architectural design decisions. <em>Working IEEE/IFIP Conference on Software Architecture</em>, 109-120.</li>
<li>Kazman, R., Cai, Y., Mo, R., Feng, Q., Xiao, L., Haziyev, S., Fedak, V., &amp; Shapochka, A. (2015). A case study in locating the architectural roots of technical debt. <em>International Conference on Software Engineering</em>, 179-188.</li>
<li>LaToza, T. D., Venolia, G., &amp; DeLine, R. (2006). Maintaining mental models: a study of developer work habits. <em>International Conference on Software Engineering</em>, 492-501.</li>
<li>Lenarduzzi, V., Lomio, F., Huttunen, H., &amp; Taibi, D. (2020). Are SonarQube rules inducing bugs? <em>International Conference on Software Analysis, Evolution and Reengineering</em>, 501-511.</li>
<li>Lenarduzzi, V., Saarimäki, N., &amp; Taibi, D. (2020). Some SonarQube issues have a significant but small effect on faults and changes. A large-scale empirical study. <em>Journal of Systems and Software</em>, 170, 110750.</li>
<li>Soldani, J., Tamburri, D. A., &amp; van den Heuvel, W.-J. (2018). The pains and gains of microservices: a systematic grey literature review. <em>Journal of Systems and Software</em>, 146, 215-232.</li>
<li>Tang, A., Babar, M. A., Gorton, I., &amp; Han, J. (2005). A survey of the use and documentation of architecture design rationale. <em>Working IEEE/IFIP Conference on Software Architecture</em>, 89-98.</li>
<li>Xiao, L., Cai, Y., &amp; Kazman, R. (2014). Design rule spaces: a new form of architecture insight. <em>International Conference on Software Engineering</em>, 967-977.</li>
</ol>
