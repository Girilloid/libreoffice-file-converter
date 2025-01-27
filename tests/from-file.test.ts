import { mkdir, writeFile } from 'node:fs/promises';

import { assertEquals, assertStringIncludes } from 'jsr:@std/assert';
import { afterEach, beforeAll, describe, it } from 'jsr:@std/testing/bdd';

import { writeStream } from '../src/helpers/fs';
import { LibreOfficeFileConverter } from '../src/libreoffice-file-converter';

import { access, clearDir, formats, outputFormat, timeout } from './helpers';
import { getInputPath, getOutputPathFactory } from './helpers-deno';

const getOutputPath = getOutputPathFactory('output-file');

const outputDir = getOutputPath('');

describe('LibreOfficeFileConverter convert from file', () => {
  let libreOfficeFileConverter: LibreOfficeFileConverter;

  beforeAll(async () => {
    const isExists = await access(outputDir);

    if (!isExists) {
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
    await clearDir(outputDir);
  });

  describe('to buffer', () => {
    formats.forEach((format) => {
      const inputFileName = `example.${format}`;
      const outputFileName = `example-${format}.${outputFormat}`;

      return it(`converts ${format} file to ${outputFormat}`, async (): Promise<void> => {
        let exception;

        try {
          const inputPath = getInputPath(inputFileName);
          const outputPath = getOutputPath(outputFileName);

          const outputBuffer = await libreOfficeFileConverter.convert({
            format: outputFormat,
            input: 'file',
            inputPath,
            output: 'buffer',
          });

          await writeFile(outputPath, outputBuffer);

          const isExists = await access(outputPath);

          assertEquals(isExists, true);
        } catch (error) {
          exception = error;
        }

        assertEquals(exception, undefined);
      });
    });

    it('converts doc to pdf (file without extension)', async () => {
      const inputFileName = 'example';
      const outputFileName = `example-no-extension.${outputFormat}`;

      let exception;

      try {
        const inputPath = getInputPath(inputFileName);
        const outputPath = getOutputPath(outputFileName);

        const outputBuffer = await libreOfficeFileConverter.convert({
          format: outputFormat,
          input: 'file',
          inputPath,
          output: 'buffer',
        });

        await writeFile(outputPath, outputBuffer);

        const isExists = await access(outputPath);

        assertEquals(isExists, true);
      } catch (error) {
        exception = error;
      }

      assertEquals(exception, undefined);
    });

    it('throws an error when fails to convert file (pdf to docx without input filter)', async (): Promise<void> => {
      let exception: Error | null = null;

      try {
        const inputPath = getInputPath('example.pdf');

        await libreOfficeFileConverter.convert({
          format: 'docx',
          input: 'file',
          inputPath,
          output: 'buffer',
        });
      } catch (error) {
        exception = error as Error;
      }

      assertStringIncludes(exception?.message || '', 'Error');
    });

    it('converts pdf to docx when input filter is provided', async (): Promise<void> => {
      let exception;

      try {
        const inputPath = getInputPath('example.pdf');
        const outputPath = getOutputPath('example-pdf.docx');

        const outputBuffer = await libreOfficeFileConverter.convert({
          format: 'docx',
          input: 'file',
          inputFilter: 'writer_pdf_import',
          inputPath,
          output: 'buffer',
        });

        await writeFile(outputPath, outputBuffer);

        const isExists = await access(outputPath);

        assertEquals(isExists, true);
      } catch (error) {
        exception = error;
      }

      assertEquals(exception, undefined);
    });
  });

  describe('to file', () => {
    formats.forEach((format) => {
      const inputFileName = `example.${format}`;
      const outputFileName = `example-${format}.${outputFormat}`;

      return it(`converts ${format} file to ${outputFormat}`, async (): Promise<void> => {
        let exception;

        try {
          const inputPath = getInputPath(inputFileName);
          const outputPath = getOutputPath(outputFileName);

          await libreOfficeFileConverter.convert({
            format: outputFormat,
            input: 'file',
            inputPath,
            output: 'file',
            outputPath,
          });

          const isExists = await access(outputPath);

          assertEquals(isExists, true);
        } catch (error) {
          exception = error;
        }

        assertEquals(exception, undefined);
      });
    });

    it('converts doc to pdf (file without extension)', async () => {
      const inputFileName = 'example';
      const outputFileName = `example-no-extension.${outputFormat}`;

      let exception;

      try {
        const inputPath = getInputPath(inputFileName);
        const outputPath = getOutputPath(outputFileName);

        await libreOfficeFileConverter.convert({
          format: outputFormat,
          input: 'file',
          inputPath,
          output: 'file',
          outputPath,
        });

        const isExists = await access(outputPath);

        assertEquals(isExists, true);
      } catch (error) {
        exception = error;
      }

      assertEquals(exception, undefined);
    });

    it('throws an error when fails to convert file (pdf to docx without input filter)', async (): Promise<void> => {
      let exception: Error | null = null;

      try {
        const inputPath = getInputPath('example.pdf');
        const outputPath = getOutputPath('example.docx');

        await libreOfficeFileConverter.convert({
          format: 'docx',
          input: 'file',
          inputPath,
          output: 'file',
          outputPath,
        });
      } catch (error) {
        exception = error as Error;
      }

      assertStringIncludes(exception?.message || '', 'Error');
    });

    it('converts pdf to docx when input filter is provided', async (): Promise<void> => {
      let exception;

      try {
        const inputPath = getInputPath('example.pdf');
        const outputPath = getOutputPath('example-pdf.docx');

        await libreOfficeFileConverter.convert({
          format: 'docx',
          input: 'file',
          inputFilter: 'writer_pdf_import',
          inputPath,
          output: 'file',
          outputPath,
        });

        const isExists = await access(outputPath);

        assertEquals(isExists, true);
      } catch (error) {
        exception = error;
      }

      assertEquals(exception, undefined);
    });
  });

  describe('to stream', () => {
    formats.forEach((format) => {
      const inputFileName = `example.${format}`;
      const outputFileName = `example-${format}.${outputFormat}`;

      return it(`converts ${format} file to ${outputFormat}`, async (): Promise<void> => {
        let exception;

        try {
          const inputPath = getInputPath(inputFileName);
          const outputPath = getOutputPath(outputFileName);

          const outputStream = await libreOfficeFileConverter.convert({
            format: outputFormat,
            input: 'file',
            inputPath,
            output: 'stream',
          });

          await writeStream(outputPath, outputStream);

          const isExists = await access(outputPath);

          assertEquals(isExists, true);
        } catch (error) {
          exception = error;
        }

        assertEquals(exception, undefined);
      });
    });

    it('converts doc to pdf (file without extension)', async () => {
      const inputFileName = 'example';
      const outputFileName = `example-no-extension.${outputFormat}`;

      let exception;

      try {
        const inputPath = getInputPath(inputFileName);
        const outputPath = getOutputPath(outputFileName);

        const outputStream = await libreOfficeFileConverter.convert({
          format: outputFormat,
          input: 'file',
          inputPath,
          output: 'stream',
        });

        await writeStream(outputPath, outputStream);

        const isExists = await access(outputPath);

        assertEquals(isExists, true);
      } catch (error) {
        exception = error;
      }

      assertEquals(exception, undefined);
    });

    it('throws an error when fails to convert file (pdf to docx without input filter)', async (): Promise<void> => {
      let exception: Error | null = null;

      try {
        const inputPath = getInputPath('example.pdf');

        await libreOfficeFileConverter.convert({
          format: 'docx',
          input: 'file',
          inputPath,
          output: 'stream',
        });
      } catch (error) {
        exception = error as Error;
      }

      assertStringIncludes(exception?.message || '', 'Error');
    });

    it('converts pdf to docx when input filter is provided', async (): Promise<void> => {
      let exception;

      try {
        const inputPath = getInputPath('example.pdf');
        const outputPath = getOutputPath('example-pdf.docx');

        const outputStream = await libreOfficeFileConverter.convert({
          format: 'docx',
          input: 'file',
          inputFilter: 'writer_pdf_import',
          inputPath,
          output: 'stream',
        });

        await writeStream(outputPath, outputStream);

        const isExists = await access(outputPath);

        assertEquals(isExists, true);
      } catch (error) {
        exception = error;
      }

      assertEquals(exception, undefined);
    });
  });
});
