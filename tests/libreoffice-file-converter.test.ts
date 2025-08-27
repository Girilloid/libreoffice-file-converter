import { mkdir, readFile, writeFile } from 'node:fs/promises';

import { assertEquals, assertGreater } from 'jsr:@std/assert';
import { afterEach, beforeAll, describe, it } from 'jsr:@std/testing/bdd';

import { LibreOfficeFileConverter } from '../src/libreoffice-file-converter';
import type { InstallationDir } from '../src/types';

import { access, clearDir, getFilesCount, timeout } from './helpers';
import { getInputPath, getOutputPathFactory } from './helpers-deno';

const getInstallationDirPath = getOutputPathFactory('installation-dir');
const getOutputPath = getOutputPathFactory('output-buffer');

const installationDir = getInstallationDirPath('');
const outputDir = getOutputPath('');

describe('LibreOfficeFileConverter', () => {
  let libreOfficeFileConverter: LibreOfficeFileConverter;

  beforeAll(async () => {
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

    const convert = async (installationDir: InstallationDir) => {
      let exception;

      try {
        const inputPath = getInputPath(inputFileName);
        const outputPath = getOutputPath(outputFileName);

        const buffer = await readFile(inputPath);

        const outputBuffer = await libreOfficeFileConverter.convert({
          buffer,
          format: 'pdf',
          input: 'buffer',
          options: { installationDir },
          output: 'buffer',
        });

        await writeFile(outputPath, outputBuffer);

        const isExists = await access(outputPath);

        assertEquals(isExists, true);
      } catch (error) {
        exception = error;
      }

      assertEquals(exception, undefined);
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
  });

  describe('init', () => {
    it('initializes libreOfficeFileConverter installation dir', async () => {
      let exception;

      try {
        await libreOfficeFileConverter.init({ installationDir });

        const filesCount = await getFilesCount(installationDir);

        assertGreater(filesCount, 0);
      } catch (error) {
        exception = error;
      }

      assertEquals(exception, undefined);
    });
  });
});
