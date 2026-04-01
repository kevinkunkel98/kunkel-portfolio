// @ts-check
import { defineConfig } from 'astro/config';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';

const __dirname = dirname(fileURLToPath(import.meta.url));
const shikiTheme = JSON.parse(
  readFileSync(resolve(__dirname, 'src/styles/shiki-theme.json'), 'utf-8')
);

export default defineConfig({
  site: 'https://kevinkunkel.dev',
  output: 'static',
  adapter: netlify(),
  vite: {
    plugins: [tailwindcss()]
  },
  markdown: {
    shikiConfig: {
      theme: shikiTheme,
    },
  },
  integrations: [react(), sitemap()]
});
