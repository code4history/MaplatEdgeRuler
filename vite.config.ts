import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));
const isPackageBuild = process.env.BUILD_MODE === 'package';

export default defineConfig({
  base: './',
  build: isPackageBuild ? {
    lib: {
      entry: resolve(__dirname, 'src/variant/constrain.ts'),
      formats: ['es', 'cjs', 'umd'],
      name: 'maplat_edgeruler',
      fileName: (format, entryName) => {
        switch(format) {
          case 'es':
            return 'maplat_edgeruler.js';
          case 'cjs':
            return 'maplat_edgeruler.cjs';
          case 'umd':
            return 'maplat_edgeruler.umd.js';
          default:
            return 'maplat_edgeruler.js';
        }
      }
    }
  } : {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]'
      }
    }
  },
  plugins: [
    dts({
      outDir: 'dist',
      exclude: ['tests'],
      rollupTypes: true
    })
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts']
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  define: {
    'import.meta.env.APP_VERSION': JSON.stringify(packageJson.version)
  }
});