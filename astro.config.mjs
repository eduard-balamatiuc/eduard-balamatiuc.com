// @ts-check
import umami from "@yeskunall/astro-umami";
import { defineConfig } from 'astro/config';
import rehypeCodeBlocks from './src/plugins/rehype-code-blocks.mjs';
import rehypeSidenotes from './src/plugins/rehype-sidenotes.mjs';

export default defineConfig({
  site: 'https://eduard-balamatiuc.com',
  markdown: {
    shikiConfig: {
      themes: {
        dark: 'monokai',
        light: 'github-light',
      },
      defaultColor: 'dark',
    },
    rehypePlugins: [rehypeSidenotes, rehypeCodeBlocks],
  },
  integrations: [
    umami({
      id: "d26387c0-ce07-49eb-bc4f-d2144349b872",}),
  ],
});