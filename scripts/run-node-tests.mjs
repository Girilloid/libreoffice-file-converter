import { spawnSync } from 'node:child_process';
import { readdirSync, rmSync } from 'node:fs';

rmSync('tests/dist/tests', {
  force: true,
  recursive: true,
});

const tsc = spawnSync(process.execPath, ['node_modules/typescript/lib/tsc.js', '-p', 'tsconfig.test.json'], {
  stdio: 'inherit',
});

if (tsc.status !== 0) {
  process.exit(tsc.status ?? 1);
}

const dir = 'tests/dist/tests';

const files = readdirSync(dir)
  .filter((file) => file.endsWith('.test.js'))
  .sort()
  .map((file) => `${dir}/${file}`);

const supportsConcurrencyFlag =
  spawnSync(process.execPath, ['--test', '--test-concurrency=1', '--help'], { stdio: 'ignore' }).status === 0;

if (supportsConcurrencyFlag) {
  const { status } = spawnSync(process.execPath, ['--test', '--test-concurrency=1', ...files], { stdio: 'inherit' });

  process.exit(status ?? 1);
}

for (const file of files) {
  const { status } = spawnSync(process.execPath, ['--test', file], { stdio: 'inherit' });

  if (status !== 0) {
    process.exit(status ?? 1);
  }
}
