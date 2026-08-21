/** Single source of truth for identity, copy and outbound links. */
export const site = {
  title: "Kokko Ng",
  url: "https://kokko-ng.github.io",
  /** Sits under the name in the rail. Keep it to one or two short sentences. */
  tagline:
    "I am an engineer at Insight Enterprises APAC, based in Singapore.",
  /** The statement at the top of the home page. */
  positioning:
    "I build systems from first principles in order to understand the mechanisms by which they actually work.",
  intro:
    "Building from first principles—henceforth understood as implementing a system from its smallest working parts rather than assembling it from existing abstractions—is the method by which I learn. The following pages document that method as it has been applied to data structures, computer architecture, and developer tooling. Each project is presented alongside the reasoning that produced it, and each note summarises what was found, with particular attention to the results that were not anticipated.",
  description:
    "The projects and written notes of Kokko Ng, an engineer in Singapore, concerning data structures, computer architecture, and agentic developer tooling.",
  quote: "If you run, you gain one. If you move forward, you gain two.",
  /** Shown in the rail. Add or remove entries freely; order is preserved. */
  links: [
    { label: "GitHub", href: "https://github.com/kokko-ng", text: "github.com/kokko-ng" },
    { label: "Email", href: "mailto:kokko.ng@insight.com", text: "kokko.ng@insight.com" },
  ],
  /** Three short lines on the home page. Set to [] to hide the block. */
  now: [
    { label: "Building", text: "An 8-bit computer, implemented one register at a time." },
    { label: "Working on", text: "Cloud engineering and agentic developer workflows on Azure." },
    {
      label: "Writing about",
      text: "The findings that become apparent only once the system has been built.",
    },
  ],
  /** Roadmap line at the top of each index page. */
  intros: {
    projects:
      "The following projects were each undertaken in order to understand a system by implementing it rather than by configuring it. Each entry is accompanied by a note on the reason it exists.",
    blog:
      "The following notes were written during the builds documented under Projects. They summarise what was found, with particular attention to the results that were not anticipated.",
  },
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects/" },
  { label: "Blog", href: "/blog/" },
] as const;
