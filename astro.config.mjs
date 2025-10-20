// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: netlify(),
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()]
});