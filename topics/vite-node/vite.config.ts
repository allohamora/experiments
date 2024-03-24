import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    // vite-node enables hmr by default and we cannot override it
    // https://github.com/vitest-dev/vitest/blob/fee7d8be9d6e6f710270600ae91fa35d861b7075/packages/vite-node/src/cli.ts#L89
    hmr: false,
  },
  build: {
    ssr: 'src/index.ts',
  }
});