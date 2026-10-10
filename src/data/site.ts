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
    "I work on cloud engineering and agentic developer workflows at Insight Enterprises in Singapore. Outside that I build things from their smallest working parts (an 8-bit computer, developer tooling) because implementing a system is the only way I reliably understand it. The projects here set out how each one was built.",
  description:
    "Projects by Kokko Ng, an engineer in Singapore, on computer architecture and agentic developer tooling.",
  quote: "If you run, you gain one. If you move forward, you gain two.",
  /** Shown in the rail. Add or remove entries freely; order is preserved. */
  links: [
    { label: "GitHub", href: "https://github.com/kokko-ng", text: "github.com/kokko-ng" },
    { label: "Email", href: "mailto:kokko.ng@insight.com", text: "kokko.ng@insight.com" },
  ],
  /** Three short lines on the home page. Set to [] to hide the block. */
  now: [
    { label: "Building", text: "An 8-bit computer." },
    { label: "Working on", text: "Cloud engineering and agentic developer workflows on Azure." },
    { label: "Reading", text: "Mechanistic interpretability, and what it does and does not support about prompting." },
  ],
  /** Roadmap line at the top of each index page. */
  intros: {
    projects:
      "Each of these exists to understand a system by implementing it rather than configuring it. Every entry carries a note on why it was worth building.",
    study:
      "What I intend to study next, and what I intend to write about once I have. Entries come off the list as they are finished.",
  },
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects/" },
  { label: "Study", href: "/study/" },
] as const;
