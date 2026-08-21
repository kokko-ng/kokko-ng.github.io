export type Project = {
  name: string;
  /** The repo's own description. */
  description: string;
  /** The reason the project exists, stated in one sentence. */
  why: string;
  href: string;
  lang: string;
  year: string;
  /** Extra facets shown next to language and year. Omit anything already in `lang`. */
  tags: string[];
};

/** Featured work, in display order. Adding a project is one entry. */
export const projects: Project[] = [
  {
    name: "pydsa",
    description:
      "Data structures and algorithms built from scratch in Python, from dynamic arrays to a graph route planner.",
    why: "The library is built across sixteen notebooks, each of which depends on the structures implemented in the one preceding it.",
    href: "https://github.com/kokko-ng/pydsa",
    lang: "Python",
    year: "2026",
    tags: ["16 notebooks"],
  },
  {
    name: "py8bit",
    description: "A complete 8-bit computer built in Python to teach computer architecture.",
    why: "Registers, the ALU, the control unit and the assembler are implemented in sequence, such that the complete machine can be held in mind at once.",
    href: "https://github.com/kokko-ng/py8bit",
    lang: "Python",
    year: "2026",
    tags: ["CPU + assembler"],
  },
  {
    name: "kokko-janitor",
    description:
      "Worktree-based codebase clean-up for Claude Code: parallel lint fixes and agent-judged refactoring.",
    why: "Git worktrees provide each agent with an independent copy of the repository, which permits a dozen of them to refactor concurrently without collision.",
    href: "https://github.com/kokko-ng/kokko-janitor",
    lang: "Shell",
    year: "2026",
    tags: ["Claude Code"],
  },
  {
    name: "remotion-tutorial",
    description:
      "Narrated technical tutorial videos with Remotion, Azure TTS voiceover, and word-synced subtitles.",
    why: "A topic is converted into an hour of animated explanation, with subtitles timed to the word rather than to the sentence.",
    href: "https://github.com/kokko-ng/remotion-tutorial",
    lang: "TypeScript",
    year: "2026",
    tags: ["Remotion"],
  },
  {
    name: "kokko-devcontainer",
    description: "Devcontainer setup for macOS with Colima, Ghostty, and Claude Code.",
    why: "The environment in which I work, specified such that it can be reproduced on a machine that has not previously been configured.",
    href: "https://github.com/kokko-ng/kokko-devcontainer",
    lang: "Dockerfile",
    year: "2026",
    tags: ["macOS"],
  },
];
