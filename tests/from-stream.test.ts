import { createReadStream } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';

import { assertEquals, assertStringIncludes } from '@std/assert';
import { afterEach, beforeAll, describe, it } from '@std/testing/bdd';

import { writeStream } from '../src/helpers/fs';
import { LibreOfficeFileConverter } from '../src/libreoffice-file-converter';

import { access, clearDir, formats, outputFormat, timeout } from './helpers';
import { getInputPath, getOutputPathFactory } from './helpers-deno';

const getOutputPath = getOutputPathFactory('output-stream');

const outputDir = getOutputPath('');

describe('LibreOfficeFileConverter convert from stream', () => {
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

          const inputStream = createReadStream(inputPath);

          const outputBuffer = await libreOfficeFileConverter.convert({
            format: outputFormat,
            input: 'stream',
            output: 'buffer',
            stream: inputStream,
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

    it('throws an error when fails to convert file (pdf to docx without input filter)', async (): Promise<void> => {
      let exception: Error | null = null;

      try {
        const inputPath = getInputPath('example.pdf');

        const inputStream = createReadStream(inputPath);

        await libreOfficeFileConverter.convert({
          format: 'docx',
          input: 'stream',
          output: 'buffer',
          stream: inputStream,
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

        const inputStream = createReadStream(inputPath);

        const outputBuffer = await libreOfficeFileConverter.convert({
          format: 'docx',
          input: 'stream',
          inputFilter: 'writer_pdf_import',
          output: 'buffer',
          stream: inputStream,
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

          const inputStream = createReadStream(inputPath);

          await libreOfficeFileConverter.convert({
            format: outputFormat,
            input: 'stream',
            output: 'file',
            outputPath,
            stream: inputStream,
          });

          const isExists = await access(outputPath);

          assertEquals(isExists, true);
        } catch (error) {
          exception = error;
        }

        assertEquals(exception, undefined);
      });
    });

    it('throws an error when fails to convert file (pdf to docx without input filter)', async (): Promise<void> => {
      let exception: Error | null = null;

      try {
        const inputPath = getInputPath('example.pdf');
        const outputPath = getOutputPath('example.docx');

        const inputStream = createReadStream(inputPath);

        await libreOfficeFileConverter.convert({
          format: 'docx',
          input: 'stream',
          output: 'file',
          outputPath,
          stream: inputStream,
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

        const inputStream = createReadStream(inputPath);

        await libreOfficeFileConverter.convert({
          format: 'docx',
          input: 'stream',
          inputFilter: 'writer_pdf_import',
          output: 'file',
          outputPath,
          stream: inputStream,
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

          const inputStream = createReadStream(inputPath);

          const outputStream = await libreOfficeFileConverter.convert({
            format: outputFormat,
            input: 'stream',
            output: 'stream',
            stream: inputStream,
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

    it('throws an error when fails to convert file (pdf to docx without input filter)', async (): Promise<void> => {
      let exception: Error | null = null;

      try {
        const inputPath = getInputPath('example.pdf');

        const inputStream = createReadStream(inputPath);

        await libreOfficeFileConverter.convert({
          format: 'docx',
          input: 'stream',
          output: 'stream',
          stream: inputStream,
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

        const inputStream = createReadStream(inputPath);

        const outputStream = await libreOfficeFileConverter.convert({
          format: 'docx',
          input: 'stream',
          inputFilter: 'writer_pdf_import',
          output: 'stream',
          stream: inputStream,
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
