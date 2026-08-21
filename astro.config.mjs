// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://kokko-ng.github.io",
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      // Two themes, emitted as CSS variables so code follows the page theme.
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
      wrap: false,
    },
  },
});
