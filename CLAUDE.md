# CLAUDE.md

## Writing

- Never use an em dash anywhere in this repository. That covers page copy, data
  files, markup, page titles, code comments, the README and commit messages, and
  every form of it: the literal character, `&mdash;`, `\u2014`, `&#8212;` and
  `&#x2014;`. Rewrite with a comma, colon, semicolon, parentheses or a separate
  sentence instead. For separators in labels and titles, use a middle dot (`·`).
- Before committing, confirm this prints nothing (it skips this file, which has to
  name the escaped forms):

  ```bash
  git ls-files ':!CLAUDE.md' | xargs grep -n -i -e $'\xe2\x80\x94' -e '&mdash;' -e '\\u2014' -e '&#8212;' -e '&#x2014;'
  ```
