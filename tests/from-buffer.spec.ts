import { mkdir, readFile, writeFile } from 'node:fs/promises';

import { writeStream } from '../src/helpers/fs';
import { LibreOfficeFileConverter } from '../src/libreoffice-file-converter';

import { access, clearDir, formats, getInputPath, getOutputPathFactory, outputFormat, timeout } from './helpers';

const getOutputPath = getOutputPathFactory('output-buffer');

const outputDir = getOutputPath('');

describe('LibreOfficeFileConverter convert from buffer', () => {
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

          const buffer = await readFile(inputPath);

          const outputBuffer = await libreOfficeFileConverter.convert({
            buffer,
            format: outputFormat,
            input: 'buffer',
            output: 'buffer',
          });

          await writeFile(outputPath, outputBuffer);

          const isExists = await access(outputPath);

          expect(isExists).toEqual(true);
        } catch (error) {
          exception = error;
        }

        expect(exception).toEqual(undefined);
      });
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
          output: 'buffer',
        });
      } catch (error) {
        exception = error as Error;
      }

      expect(exception?.message).toContain('Error');
    });

    it('converts pdf to docx when input filter is provided', async (): Promise<void> => {
      let exception;

      try {
        const inputPath = getInputPath('example.pdf');
        const outputPath = getOutputPath('example-pdf.docx');

        const buffer = await readFile(inputPath);

        const outputBuffer = await libreOfficeFileConverter.convert({
          buffer,
          format: 'docx',
          input: 'buffer',
          inputFilter: 'writer_pdf_import',
          output: 'buffer',
        });

        await writeFile(outputPath, outputBuffer);

        const isExists = await access(outputPath);

        expect(isExists).toEqual(true);
      } catch (error) {
        exception = error;
      }

      expect(exception).toEqual(undefined);
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

          const buffer = await readFile(inputPath);

          await libreOfficeFileConverter.convert({
            buffer,
            format: outputFormat,
            input: 'buffer',
            output: 'file',
            outputPath,
          });

          const isExists = await access(outputPath);

          expect(isExists).toEqual(true);
        } catch (error) {
          exception = error;
        }

        expect(exception).toEqual(undefined);
      });
    });

    it('throws an error when fails to convert file (pdf to docx without input filter)', async (): Promise<void> => {
      let exception: Error | null = null;

      try {
        const inputPath = getInputPath('example.pdf');
        const outputPath = getOutputPath('example.docx');

        const buffer = await readFile(inputPath);

        await libreOfficeFileConverter.convert({
          buffer,
          format: 'docx',
          input: 'buffer',
          output: 'file',
          outputPath,
        });
      } catch (error) {
        exception = error as Error;
      }

      expect(exception?.message).toContain('Error');
    });

    it('converts pdf to docx when input filter is provided', async (): Promise<void> => {
      let exception;

      try {
        const inputPath = getInputPath('example.pdf');
        const outputPath = getOutputPath('example-pdf.docx');

        const buffer = await readFile(inputPath);

        await libreOfficeFileConverter.convert({
          buffer,
          format: 'docx',
          input: 'buffer',
          inputFilter: 'writer_pdf_import',
          output: 'file',
          outputPath,
        });

        const isExists = await access(outputPath);

        expect(isExists).toEqual(true);
      } catch (error) {
        exception = error;
      }

      expect(exception).toEqual(undefined);
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

          const buffer = await readFile(inputPath);

          const outputStream = await libreOfficeFileConverter.convert({
            buffer,
            format: outputFormat,
            input: 'buffer',
            output: 'stream',
          });

          await writeStream(outputPath, outputStream);

          const isExists = await access(outputPath);

          expect(isExists).toEqual(true);
        } catch (error) {
          exception = error;
        }

        expect(exception).toEqual(undefined);
      });
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
          output: 'stream',
        });
      } catch (error) {
        exception = error as Error;
      }

      expect(exception?.message).toContain('Error');
    });

    it('converts pdf to docx when input filter is provided', async (): Promise<void> => {
      let exception;

      try {
        const inputPath = getInputPath('example.pdf');
        const outputPath = getOutputPath('example-pdf.docx');

        const buffer = await readFile(inputPath);

        const outputStream = await libreOfficeFileConverter.convert({
          buffer,
          format: 'docx',
          input: 'buffer',
          inputFilter: 'writer_pdf_import',
          output: 'stream',
        });

        await writeStream(outputPath, outputStream);

        const isExists = await access(outputPath);

        expect(isExists).toEqual(true);
      } catch (error) {
        exception = error;
      }

      expect(exception).toEqual(undefined);
    });
  });
});
