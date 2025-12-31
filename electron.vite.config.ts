import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'electron-vite';
import { resolve } from 'path';
import { viteSingleFile } from 'vite-plugin-singlefile';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ command }) => ({
  main: {
    plugins: [tsconfigPaths()],
    build: {
      externalizeDeps: true
    }
  },
  preload: {
    plugins: [tsconfigPaths()],
    build: {
      externalizeDeps: true
    }
  },
  renderer: {
    base: './',
    publicDir: resolve(__dirname, 'public'),
    resolve: {
      alias: {
        '@renderer': resolve(__dirname, 'src/renderer/src'),
        '@game': resolve(__dirname, 'src/renderer/src/game'),
        '@public': resolve(__dirname, 'public/assets'),
        '@': resolve(__dirname, 'src/renderer/src')
      }
    },
    plugins: [
      react(),
      tailwindcss(),
      tsconfigPaths(),
      ...(command === 'build' ? [viteSingleFile()] : [])
    ],
    build: {
      /*
      rollupOptions: {
        output: {
          manualChunks: {
            phaser: ['phaser']
          }
        }
      },
      */
      cssCodeSplit: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          passes: 2
        },
        mangle: true,
        format: {
          comments: false
        }
      },
      assetsInlineLimit: 10_000_000_000
    }
  }
}));
