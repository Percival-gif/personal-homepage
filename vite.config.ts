import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'pages-fallback-base',
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: '404.html',
          source: readFileSync(new URL('./public/404.html', import.meta.url), 'utf8')
            .replace('__PAGES_BASE_JSON__', JSON.stringify(base)),
        });
      },
    },
  ],
  base,
  server: { allowedHosts: ["terminal.local"] },
});
