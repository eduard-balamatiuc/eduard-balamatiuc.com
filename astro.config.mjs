// @ts-check
import umami from "@yeskunall/astro-umami";
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://eduard-balamatiuc.com',
  integrations: [
    umami({
      id: "d26387c0-ce07-49eb-bc4f-d2144349b872",}),
  ],
});