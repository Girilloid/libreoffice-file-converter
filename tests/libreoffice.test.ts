import assert from 'node:assert/strict';
import { rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { after, before, describe, it } from 'node:test';

import { dir } from 'tmp-promise';
import type { DirectoryResult } from 'tmp-promise';

import { getLibreOfficeExecutablePath } from '../src/helpers/libreoffice';

describe('helpers/libreoffice', () => {
  let tmpDir: DirectoryResult;
  let executablePath: string;

  before(async () => {
    tmpDir = await dir({ prefix: 'libreoffice-file-converter-executable-', unsafeCleanup: true });

    executablePath = join(tmpDir.path, 'soffice');

    await writeFile(executablePath, '');
  });

  after(async () => {
    await tmpDir.cleanup();
  });

  it('returns provided binary path', async (): Promise<void> => {
    const result = await getLibreOfficeExecutablePath([executablePath]);

    assert.equal(result, executablePath);
  });

  it('caches resolved path per binary paths', async (): Promise<void> => {
    await rm(executablePath);

    const result = await getLibreOfficeExecutablePath([executablePath]);

    assert.equal(result, executablePath);
  });
});
