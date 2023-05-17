import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  outDir: 'dist',
  platform: 'node',
  skipNodeModulesBundle: true,
  sourcemap: true,
  splitting: true,
  target: 'es2020',
  treeshake: true,
});
