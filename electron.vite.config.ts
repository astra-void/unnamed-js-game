import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import { resolve } from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), tsconfigPaths()]
  },
  preload: {
    plugins: [externalizeDepsPlugin(), tsconfigPaths()]
  },
  renderer: {
    publicDir: resolve(__dirname, 'public'),
    resolve: {
      alias: {
        '@renderer': resolve(__dirname, 'src/renderer/src'),
        '@game': resolve(__dirname, 'src/renderer/src/game'),
        '@public': resolve(__dirname, 'public/assets'),
        '@': resolve(__dirname, 'src/renderer/src')
      }
    },
    plugins: [react(), tailwindcss(), tsconfigPaths()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            phaser: ['phaser']
          }
        }
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          passes: 2
        },
        mangle: true,
        format: {
          comments: false
        }
      }
    }
  }
});
