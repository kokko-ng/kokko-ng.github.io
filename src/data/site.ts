/** Single source of truth for identity, copy and outbound links. */
export const site = {
  title: "Kokko Ng",
  url: "https://kokko-ng.github.io",
  /** Sits under the name in the rail. Keep it to one or two short sentences. */
  tagline: "Engineer at Insight Enterprises APAC, based in Singapore.",
  /** The statement at the top of the home page. */
  positioning:
    "I build systems from first principles to understand how they actually work.",
  intro:
    "Building from first principles means implementing a system from its smallest working parts, rather than assembling it from abstractions someone else wrote. That is how I learn. These pages document the method applied to data structures, computer architecture, and developer tooling: each project is set out with the reasoning that produced it, and each note records what I found, including the results I did not expect.",
  description:
    "Projects and notes by Kokko Ng, an engineer in Singapore, on data structures, computer architecture, and agentic developer tooling.",
  quote: "If you run, you gain one. If you move forward, you gain two.",
  /** Shown in the rail. Add or remove entries freely; order is preserved. */
  links: [
    { label: "GitHub", href: "https://github.com/kokko-ng", text: "github.com/kokko-ng" },
    { label: "Email", href: "mailto:kokko.ng@insight.com", text: "kokko.ng@insight.com" },
  ],
  /** Three short lines on the home page. Set to [] to hide the block. */
  now: [
    { label: "Building", text: "An 8-bit computer, one register at a time." },
    { label: "Working on", text: "Cloud engineering and agentic developer workflows on Azure." },
    { label: "Writing about", text: "What only becomes clear once the system is built." },
  ],
  /** Roadmap line at the top of each index page. */
  intros: {
    projects:
      "Each of these exists to understand a system by implementing it rather than configuring it. Every entry carries a note on why it was worth building.",
    blog:
      "These notes were written during the builds listed under Projects. They record what I found, and in particular the results I did not expect.",
  },
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects/" },
  { label: "Blog", href: "/blog/" },
] as const;
