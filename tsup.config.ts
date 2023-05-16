import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  entry: ['src/index.ts'],
  platform: 'node',
  skipNodeModulesBundle: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
});
