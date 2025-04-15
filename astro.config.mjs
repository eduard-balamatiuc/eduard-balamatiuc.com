// @ts-check
import { defineConfig } from 'astro/config';

// Get the base path from environment variable or use default
// @ts-ignore
const BASE_PATH = process.env.PUBLIC_BASE_PATH || '/';

export default defineConfig({
  site: 'https://eduard-balamatiuc.com',
  base: BASE_PATH,
});