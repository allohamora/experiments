import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';

import { tanstackStart } from '@tanstack/react-start/plugin/vite';

import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart({
      pages: [
        {
          path: '/prerender',
          prerender: {
            enabled: true,
          },
        },
      ],
    }),
    nitro({
      serverDir: 'src/server',
      features: {
        websocket: true,
      },
    }),
    viteReact(),
  ],
});

export default config;
