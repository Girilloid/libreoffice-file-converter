import { defineConfig } from 'tsdown';

export default defineConfig({
  clean: true,
  dts: { resolver: 'tsc' },
  entry: ['src/index.ts'],
  exports: { inlinedDependencies: false },
  format: ['cjs', 'esm'],
  outDir: 'dist',
  platform: 'node',
  sourcemap: true,
  target: 'es2020',
  treeshake: true,
});
