export type Topic = {
  name: string;
  /** What the topic covers, or the point at which it counts as done. Optional. */
  note?: string;
  /** Shown on the right of the row. One or two words. */
  area: string;
  href?: string;
};

/** Topics to study, in no particular order. Remove an entry once it is done. */
export const study: Topic[] = [
  {
    name: "Mechanistic interpretability",
    note: "Circuits, and whether different models converge on the same internal features.",
    area: "AI",
  },
  {
    name: "Consciousness in language models",
    note: "The philosophy, and what the literature does and does not claim.",
    area: "AI",
  },
  {
    name: "py8bit",
    note: "My own 8-bit computer, read end to end until I can explain every part of it unaided.",
    area: "Architecture",
    href: "https://github.com/kokko-ng/py8bit",
  },
  {
    name: "Data structures and algorithms",
    note: "The foundation a formal computer science degree would have given me.",
    area: "CS",
  },
  {
    name: "Microsoft Fabric",
    note: "Enough to pass DP-700 (Data Engineer) and DP-600 (Analytics Engineer) with confidence.",
    area: "Certification",
  },
  {
    name: "Home labbing and networking",
    note: "A working home lab, and enough networking to pass the CCNA.",
    area: "Certification",
  },
  {
    name: "John Ousterhout on software design",
    note: "His teaching on software architecture: complexity, deep modules, information hiding.",
    area: "Architecture",
  },
  {
    name: "John Carmack’s techniques",
    note: "The engineering tricks he used across his game development work.",
    area: "Game dev",
  },
  {
    name: "Claude for video editing",
    area: "Tooling",
  },
  {
    name: "Claude for game development",
    area: "Tooling",
  },
  {
    name: "Unity and Godot",
    note: "How the two engines compare, and which to commit to.",
    area: "Game dev",
  },
  {
    name: "APAC IT consulting",
    note: "The main players in the region and how each one positions itself.",
    area: "Industry",
  },
  {
    name: "The OSI model on Azure",
    note: "Each layer, and the Azure services and controls that operate at it.",
    area: "Networking",
  },
  {
    name: "The Big Five personality traits",
    note: "Where I sit on each trait, and how to use that to arrange my work and personal life.",
    area: "Self",
  },
];

/** Posts to write, in no particular order. */
export const writing: Topic[] = [
  {
    name: "My agentic coding setup, November 2026",
    note: "Ghostty, kokko-devcontainer, Claude Code plugins and skills, and CLAUDE.md.",
    area: "Tooling",
  },
  {
    name: "Playing with evals",
    area: "AI",
  },
  {
    name: "Reflections on Range",
    note: "How model making (Gunpla especially), cell biology and writing inform my consulting work, from agentic coding to running design thinking sessions with clients.",
    area: "Essay",
  },
  {
    name: "Learning about design",
    area: "Essay",
  },
  {
    name: "Treating YouTube like a university",
    area: "Essay",
  },
];
