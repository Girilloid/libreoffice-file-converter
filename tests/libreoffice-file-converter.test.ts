import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { createWriteStream } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { after, afterEach, before, describe, it } from 'node:test';
import { setImmediate } from 'node:timers/promises';

import type { DirOptions } from 'tmp';
import { dir } from 'tmp-promise';
import type { DirectoryResult } from 'tmp-promise';

import { LibreOfficeFileConverter } from '../src/libreoffice-file-converter';
import type { ConvertOptions, InstallationDir } from '../src/types';
import { access, clearDir, getFilesCount, getInputPath, getOutputPathFactory, timeout } from './helpers';

const getInstallationDirPath = getOutputPathFactory('installation-dir');
const getOutputPath = getOutputPathFactory('output-buffer');

const installationDir = getInstallationDirPath('');
const outputDir = getOutputPath('');

const waitForEmptyDir = async (path: string): Promise<void> => {
  for (let attempt = 0; attempt < 1000; attempt += 1) {
    const filesCount = await getFilesCount(path);

    if (filesCount === 0) {
      return;
    }

    await setImmediate();
  }
};

describe('LibreOfficeFileConverter', () => {
  let libreOfficeFileConverter: LibreOfficeFileConverter;

  before(async () => {
    const isInstallationDirExists = await access(installationDir);
    const isOutputDirExists = await access(outputDir);

    if (!isInstallationDirExists) {
      await mkdir(installationDir);
    } else {
      await clearDir(installationDir);
    }

    if (!isOutputDirExists) {
      await mkdir(outputDir);
    } else {
      await clearDir(outputDir);
    }

    libreOfficeFileConverter = new LibreOfficeFileConverter({
      childProcessOptions: {
        timeout,
      },
      debug: true,
    });
  });

  afterEach(async () => {
    await clearDir(installationDir);
    await clearDir(outputDir);
  });

  describe('convert', () => {
    const inputFileName = 'example.doc';
    const outputFileName = 'example-doc.pdf';

    const convert = async (
      installationDir: InstallationDir,
      convertOptions: Partial<
        Pick<
          ConvertOptions,
          'convertImagesTo' | 'format' | 'inputFilter' | 'inputFilterOptions' | 'outputFilter' | 'outputFilterOptions'
        >
      > = {},
      inputBuffer?: Buffer,
    ) => {
      let exception;

      let outputBuffer: Buffer | undefined;

      try {
        const inputPath = getInputPath(inputFileName);
        const outputPath = getOutputPath(outputFileName);

        const buffer = inputBuffer || (await readFile(inputPath));

        outputBuffer = await libreOfficeFileConverter.convert({
          buffer,
          format: 'pdf',
          input: 'buffer',
          options: { installationDir },
          output: 'buffer',
          ...convertOptions,
        });

        await writeFile(outputPath, outputBuffer);

        const isExists = await access(outputPath);

        assert.equal(isExists, true);
      } catch (error) {
        exception = error;
      }

      assert.equal(exception, undefined);

      return outputBuffer;
    };

    it('converts file with default installation dir', async () => {
      await convert('default');
    });

    it('converts file with dynamic installation dir', async () => {
      await convert('dynamic');
    });

    it('converts file with custom installation dir', async () => {
      await convert(installationDir);
    });

    it('converts with string output filter options', async (): Promise<void> => {
      const outputBuffer = await convert('dynamic', {
        format: 'txt',
        outputFilter: 'Text (encoded)',
        outputFilterOptions: 'UTF8',
      });

      assert.ok(outputBuffer !== undefined && outputBuffer.toString('utf-8').trim().length > 0);
    });

    it('converts with object output filter options', async (): Promise<void> => {
      const outputBuffer = await convert('dynamic', {
        outputFilter: 'writer_pdf_Export',
        outputFilterOptions: {
          SelectPdfVersion: {
            type: 'long',
            value: '2',
          },
        },
      });

      assert.ok(outputBuffer !== undefined && outputBuffer.toString('latin1').includes('pdfaid:part'));
    });

    it('converts with input filter options', async (): Promise<void> => {
      const outputBuffer = await convert(
        'dynamic',
        {
          format: 'ods',
          inputFilter: 'Text - txt - csv (StarCalc)',
          inputFilterOptions: '44,34,76,1',
        },
        Buffer.from('A,B,C\n1,2,3\n4,5,6', 'utf-8'),
      );

      assert.ok(outputBuffer !== undefined && outputBuffer.length > 0);
    });

    it('throws for unsupported input type', async (): Promise<void> => {
      let exception: Error | null = null;

      try {
        await libreOfficeFileConverter.convert({
          format: 'pdf',
          input: 'type',
          output: 'buffer',
        } as never);
      } catch (error) {
        exception = error as Error;
      }

      assert.ok((exception?.message || '').includes('Unsupported input type: type'));
    });

    it('throws for unsupported output type', async (): Promise<void> => {
      let exception: Error | null = null;

      try {
        const inputPath = getInputPath('example.doc');

        const buffer = await readFile(inputPath);

        await libreOfficeFileConverter.convert({
          buffer,
          format: 'pdf',
          input: 'buffer',
          output: 'type',
        } as never);
      } catch (error) {
        exception = error as Error;
      }

      assert.ok((exception?.message || '').includes('Unsupported output type: type'));
    });
  });

  describe('init', () => {
    it('initializes libreOfficeFileConverter installation dir', async () => {
      let exception;

      try {
        await libreOfficeFileConverter.init({ installationDir });

        const filesCount = await getFilesCount(installationDir);

        assert.ok(filesCount > 0);
      } catch (error) {
        exception = error;
      }

      assert.equal(exception, undefined);
    });
  });

  describe('temporary dir cleanup', () => {
    let tmpDir: DirectoryResult;
    let tmpOptions: DirOptions;

    before(async () => {
      tmpDir = await dir({
        prefix: 'libreoffice-file-converter-cleanup-',
        unsafeCleanup: true,
      });
      tmpOptions = { tmpdir: tmpDir.path };
    });

    after(async () => {
      await tmpDir.cleanup();
    });

    it('cleans up temporary dir after buffer output', async (): Promise<void> => {
      let exception;

      try {
        const inputPath = getInputPath('example.docx');

        const buffer = await readFile(inputPath);

        await libreOfficeFileConverter.convert({
          buffer,
          format: 'pdf',
          input: 'buffer',
          options: { tmpOptions },
          output: 'buffer',
        });

        const filesCount = await getFilesCount(tmpDir.path);

        assert.equal(filesCount, 0);
      } catch (error) {
        exception = error;
      }

      assert.equal(exception, undefined);
    });

    it('cleans up temporary dir after file output', async (): Promise<void> => {
      let exception;

      try {
        const inputPath = getInputPath('example.docx');
        const outputPath = getOutputPath('example-docx-cleanup.pdf');

        await libreOfficeFileConverter.convert({
          format: 'pdf',
          input: 'file',
          inputPath,
          options: { tmpOptions },
          output: 'file',
          outputPath,
        });

        const filesCount = await getFilesCount(tmpDir.path);

        assert.equal(filesCount, 0);
      } catch (error) {
        exception = error;
      }

      assert.equal(exception, undefined);
    });

    it('cleans up temporary dir after stream close', async (): Promise<void> => {
      let exception;

      try {
        const inputPath = getInputPath('example.docx');
        const outputPath = getOutputPath('example-docx-cleanup-stream.pdf');

        const buffer = await readFile(inputPath);

        const outputStream = await libreOfficeFileConverter.convert({
          buffer,
          format: 'pdf',
          input: 'buffer',
          options: { tmpOptions },
          output: 'stream',
        });

        await pipeline(outputStream, createWriteStream(outputPath));

        await waitForEmptyDir(tmpDir.path);

        const filesCount = await getFilesCount(tmpDir.path);

        assert.equal(filesCount, 0);
      } catch (error) {
        exception = error;
      }

      assert.equal(exception, undefined);
    });

    it('throws an error when fails to convert file (pdf to docx without input filter)', async (): Promise<void> => {
      let exception: Error | null = null;

      try {
        const inputPath = getInputPath('example.pdf');

        const buffer = await readFile(inputPath);

        await libreOfficeFileConverter.convert({
          buffer,
          format: 'docx',
          input: 'buffer',
          options: { tmpOptions },
          output: 'buffer',
        });
      } catch (error) {
        exception = error as Error;
      }

      assert.ok((exception?.message || '').includes('Error'));

      const filesCount = await getFilesCount(tmpDir.path);

      assert.equal(filesCount, 0);
    });

    it('throws an error when fails to convert file to stream (pdf to docx without input filter)', async (): Promise<void> => {
      let exception: Error | null = null;

      try {
        const inputPath = getInputPath('example.pdf');

        const buffer = await readFile(inputPath);

        await libreOfficeFileConverter.convert({
          buffer,
          format: 'docx',
          input: 'buffer',
          options: { tmpOptions },
          output: 'stream',
        });
      } catch (error) {
        exception = error as Error;
      }

      assert.ok((exception?.message || '').includes('Error'));

      const filesCount = await getFilesCount(tmpDir.path);

      assert.equal(filesCount, 0);
    });
  });
});
