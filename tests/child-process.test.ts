import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';
import { after, before, describe, it } from 'node:test';

import { dir } from 'tmp-promise';
import type { DirectoryResult } from 'tmp-promise';

import { execFileAsync } from '../src/helpers/child-process';

const getErrorCause = (error: unknown): unknown => {
  if (error instanceof Error && 'cause' in error) {
    return error.cause;
  }

  return undefined;
};

describe('helpers/child-process', () => {
  let tmpDir: DirectoryResult;
  let scriptIndex = 0;

  before(async () => {
    tmpDir = await dir({
      prefix: 'libreoffice-file-converter-child-process-',
      unsafeCleanup: true,
    });
  });

  after(async () => {
    await tmpDir.cleanup();
  });

  const writeScript = async (code: string): Promise<string> => {
    scriptIndex += 1;

    const scriptPath = join(tmpDir.path, `script-${scriptIndex}.js`);

    await writeFile(scriptPath, code);

    return scriptPath;
  };

  it('throws error with stderr message and original error as cause', async (): Promise<void> => {
    const scriptPath = await writeScript('console.error("Error: message"); process.exit(1);');

    let exception: Error | null = null;

    try {
      await execFileAsync(process.execPath, [scriptPath]);
    } catch (error) {
      exception = error as Error;
    }

    assert.ok(exception);
    assert.ok(exception.message.includes('Error: message'));
    assert.ok(getErrorCause(exception) instanceof Error);
  });

  it('throws error with stderr message and no cause when exit code is zero', async (): Promise<void> => {
    const scriptPath = await writeScript('console.error("Error: message");');

    let exception: Error | null = null;

    try {
      await execFileAsync(process.execPath, [scriptPath]);
    } catch (error) {
      exception = error as Error;
    }

    assert.ok(exception);
    assert.ok(exception.message.includes('Error: message'));
    assert.equal(getErrorCause(exception), undefined);
  });

  it('throws spawn error message when stderr is empty', async (): Promise<void> => {
    let exception: Error | null = null;

    try {
      await execFileAsync(join(tmpDir.path, 'nonexistent-executable'), []);
    } catch (error) {
      exception = error as Error;
    }

    assert.ok(exception);
    assert.ok(exception.message.includes('ENOENT'));
    assert.ok(getErrorCause(exception) instanceof Error);
  });
});
