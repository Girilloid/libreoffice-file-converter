import assert from 'node:assert/strict';
import { chmod, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';
import { after, before, describe, it } from 'node:test';
import { pathToFileURL } from 'node:url';

import { dir } from 'tmp-promise';
import type { DirectoryResult } from 'tmp-promise';

import {
  getLibreOfficeConvertCommandArgs,
  getLibreOfficeExecutablePath,
  getLibreOfficeInitCommandArgs,
} from '../src/helpers/libreoffice';

describe('helpers/libreoffice', () => {
  let tmpDir: DirectoryResult;
  let executablePath: string;

  before(async () => {
    tmpDir = await dir({ prefix: 'libreoffice-file-converter-executable-', unsafeCleanup: true });

    executablePath = join(tmpDir.path, 'soffice');

    await writeFile(executablePath, '');
    await chmod(executablePath, 0o755);
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

  it('skips non-executable binary path', { skip: process.platform === 'win32' }, async (): Promise<void> => {
    const staticPath = join(tmpDir.path, 'soffice-static');

    await writeFile(staticPath, '');

    let exception;

    try {
      const result = await getLibreOfficeExecutablePath([staticPath]);

      assert.ok(result !== staticPath);
    } catch (error) {
      exception = error;
    }

    assert.equal(exception, undefined);
  });

  describe('getLibreOfficeInitCommandArgs', () => {
    it('builds init args with installation dir', () => {
      const installationDir = '/installation';

      const args = getLibreOfficeInitCommandArgs(installationDir);

      assert.deepEqual(args, [
        `-env:UserInstallation=${pathToFileURL(installationDir).toString()}`,
        '--headless',
        '--norestore',
        '--nolockcheck',
        '--terminate_after_init',
      ]);
    });
  });

  describe('getLibreOfficeConvertCommandArgs', () => {
    it('builds default convert args', () => {
      const args = getLibreOfficeConvertCommandArgs({
        format: 'pdf',
        inputPath: '/input/source',
        installationDir: '',
        outputDir: '/output',
      });

      assert.deepEqual(args, [
        '--headless',
        '--norestore',
        '--nolockcheck',
        '--convert-to',
        'pdf',
        '--outdir',
        '/output',
        '/input/source',
      ]);
    });

    it('appends output filter and object filter options', () => {
      const args = getLibreOfficeConvertCommandArgs({
        format: 'pdf',
        inputPath: '/input/source',
        installationDir: '',
        outputDir: '/output',
        outputFilter: 'writer_pdf_Export',
        outputFilterOptions: {
          Watermark: {
            type: 'string',
            value: 'DRAFT',
          },
        },
      });

      assert.deepEqual(args, [
        '--headless',
        '--norestore',
        '--nolockcheck',
        '--convert-to',
        'pdf:writer_pdf_Export:{"Watermark":{"type":"string","value":"DRAFT"}}',
        '--outdir',
        '/output',
        '/input/source',
      ]);
    });

    it('passes string filter options verbatim', () => {
      const args = getLibreOfficeConvertCommandArgs({
        format: 'txt',
        inputPath: '/input/source',
        installationDir: '',
        outputDir: '/output',
        outputFilter: 'Text (encoded)',
        outputFilterOptions: 'UTF8',
      });

      assert.deepEqual(args, [
        '--headless',
        '--norestore',
        '--nolockcheck',
        '--convert-to',
        'txt:Text (encoded):UTF8',
        '--outdir',
        '/output',
        '/input/source',
      ]);
    });

    it('appends input filter options', () => {
      const args = getLibreOfficeConvertCommandArgs({
        format: 'pdf',
        inputFilter: 'Text - txt - csv (StarCalc)',
        inputFilterOptions: '44,34,76,1',
        inputPath: '/input/source',
        installationDir: '',
        outputDir: '/output',
      });

      assert.deepEqual(args, [
        '--headless',
        '--norestore',
        '--nolockcheck',
        '--infilter=Text - txt - csv (StarCalc):44,34,76,1',
        '--convert-to',
        'pdf',
        '--outdir',
        '/output',
        '/input/source',
      ]);
    });

    it('ignores input filter options without filter name', () => {
      const args = getLibreOfficeConvertCommandArgs({
        format: 'pdf',
        inputFilterOptions: '44,34,76,1',
        inputPath: '/input/source',
        installationDir: '',
        outputDir: '/output',
      });

      assert.deepEqual(args, [
        '--headless',
        '--norestore',
        '--nolockcheck',
        '--convert-to',
        'pdf',
        '--outdir',
        '/output',
        '/input/source',
      ]);
    });

    it('places convert images to before input path', () => {
      const args = getLibreOfficeConvertCommandArgs({
        convertImagesTo: 'jpg',
        format: 'html',
        inputPath: '/input/source',
        installationDir: '',
        outputDir: '/output',
      });

      assert.deepEqual(args, [
        '--headless',
        '--norestore',
        '--nolockcheck',
        '--convert-to',
        'html',
        '--outdir',
        '/output',
        '--convert-images-to',
        'jpg',
        '/input/source',
      ]);
    });
  });
});
