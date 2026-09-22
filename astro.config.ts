import {
  defineConfig,
  envField,
  fontProviders,
  svgoOptimizer,
} from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import rehypeCallouts from "rehype-callouts";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import config from "./astro-paper.config";

export default defineConfig({
  site: config.site.url,
  integrations: [
    mdx(),
    sitemap({
      filter: page =>
        config.features?.showArchives !== false || !page.endsWith("/archives/"),
    }),
  ],
  i18n: {
    locales: ["ko"],
    defaultLocale: "ko",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    processor: unified({
      remarkPlugins: [
        remarkToc,
        [remarkCollapse, { test: "Table of contents" }],
      ],
      rehypePlugins: [rehypeCallouts],
    }),
    shikiConfig: {
      themes: { light: "min-light", dark: "github-dark" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  // Fonts are self-hosted via @fontsource (local provider) instead of Astro's
  // live Google Fonts provider, so the build never depends on network access
  // to fonts.google.com (handy in sandboxes/CI with restricted egress, and
  // slightly faster besides).
  fonts: [
    {
      name: "Google Sans Code",
      cssVariable: "--font-google-sans-code",
      provider: fontProviders.local(),
      fallbacks: ["monospace"],
      options: {
        variants: [
          { weight: 300, style: "normal" as const, src: ["@fontsource/google-sans-code/files/google-sans-code-latin-300-normal.woff"] },
          { weight: 300, style: "italic" as const, src: ["@fontsource/google-sans-code/files/google-sans-code-latin-300-italic.woff"] },
          { weight: 400, style: "normal" as const, src: ["@fontsource/google-sans-code/files/google-sans-code-latin-400-normal.woff"] },
          { weight: 400, style: "italic" as const, src: ["@fontsource/google-sans-code/files/google-sans-code-latin-400-italic.woff"] },
          { weight: 500, style: "normal" as const, src: ["@fontsource/google-sans-code/files/google-sans-code-latin-500-normal.woff"] },
          { weight: 500, style: "italic" as const, src: ["@fontsource/google-sans-code/files/google-sans-code-latin-500-italic.woff"] },
          { weight: 600, style: "normal" as const, src: ["@fontsource/google-sans-code/files/google-sans-code-latin-600-normal.woff"] },
          { weight: 600, style: "italic" as const, src: ["@fontsource/google-sans-code/files/google-sans-code-latin-600-italic.woff"] },
          { weight: 700, style: "normal" as const, src: ["@fontsource/google-sans-code/files/google-sans-code-latin-700-normal.woff"] },
          { weight: 700, style: "italic" as const, src: ["@fontsource/google-sans-code/files/google-sans-code-latin-700-italic.woff"] },
        ] as [
          { weight: number; style: "normal" | "italic"; src: [string] },
          ...{ weight: number; style: "normal" | "italic"; src: [string] }[],
        ],
      },
    },
    {
      // Pixel/arcade display font used for headings, the site logo and nav.
      name: "Press Start 2P",
      cssVariable: "--font-press-start-2p",
      provider: fontProviders.local(),
      fallbacks: ["monospace"],
      options: {
        variants: [
          {
            weight: 400,
            style: "normal",
            src: [
              "@fontsource/press-start-2p/files/press-start-2p-latin-400-normal.woff",
            ],
          },
        ],
      },
    },
  ],
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
});
