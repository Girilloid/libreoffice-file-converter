import { createReadStream } from 'node:fs';
import { access as fsAccess, mkdir, readdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { writeFileStreamAsync } from '../src/helpers/fs.helpers';
import { LibreOfficeFileConverter } from '../src/libreoffice-file-converter';

const access = async (path: string): Promise<boolean> => {
  try {
    await fsAccess(path);

    return true;
  } catch {
    return false;
  }
};

const clearDir = async (path): Promise<void> => {
  const files = await readdir(path);

  await Promise.all(
    files.map((file) => {
      return unlink(join(path, file));
    }),
  );
};

const getInputPath = (fileName: string): string => {
  return join(__dirname, '/resources', fileName);
};

const getOutputPath = (fileName: string): string => {
  return join(__dirname, '/resources/output', fileName);
};

const outputDir = getOutputPath('');
const outputFormat = 'pdf';
const timeout = 10 * 1000;

const formats = ['doc', 'docx', 'gif', 'jpg', 'odp', 'ods', 'odt', 'png', 'ppt', 'rtf', 'xls', 'xlsx'];

describe('LibreOfficeFileConverter', () => {
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

  describe('convertBuffer()', () => {
    formats.forEach((format) => {
      const inputFileName = `example.${format}`;
      const outputFileName = `example-${format}.${outputFormat}`;

      return it(`Should convert ${format} file to ${outputFormat}`, async (): Promise<void> => {
        let exception;

        try {
          const inputPath = getInputPath(inputFileName);
          const outputPath = getOutputPath(outputFileName);

          const buffer = await readFile(inputPath);

          const resultBuffer = await libreOfficeFileConverter.convertBuffer(buffer, outputFormat);

          await writeFile(outputPath, resultBuffer);

          const isExists = await access(outputPath);

          expect(isExists).toBe(true);
        } catch (error) {
          exception = error;
        }

        expect(exception).toBe(undefined);
      });
    });

    it('Should throw an error when libreoffice fails to convert file', async (): Promise<void> => {
      let exception;

      try {
        const inputPath = getInputPath('example.pdf');

        const buffer = await readFile(inputPath);

        await libreOfficeFileConverter.convertBuffer(buffer, 'docx');
      } catch (error) {
        exception = error;
      }

      expect(exception).toContain('Error');
    });
  });

  describe('convertFile()', () => {
    formats.forEach((format) => {
      const inputFileName = `example.${format}`;

      return it(`Should convert ${format} file to ${outputFormat}`, async (): Promise<void> => {
        let exception;

        try {
          const inputPath = getInputPath(inputFileName);

          await libreOfficeFileConverter.convertFile(inputPath, outputDir, outputFormat);

          const outputPath = getOutputPath(`example.${outputFormat}`);

          const isExists = await access(outputPath);

          expect(isExists).toBe(true);
        } catch (error) {
          exception = error;
        }

        expect(exception).toBe(undefined);
      });
    });

    it('Should throw an error when libreoffice fails to convert file', async (): Promise<void> => {
      let exception;

      try {
        const inputPath = getInputPath('example.pdf');

        await libreOfficeFileConverter.convertFile(inputPath, outputDir, 'docx');
      } catch (error) {
        exception = error;
      }

      expect(exception).toContain('Error');
    });
  });

  describe('convertStream()', () => {
    formats.forEach((format) => {
      const inputFileName = `example.${format}`;
      const outputFileName = `example-${format}.${outputFormat}`;

      return it(`Should convert ${format} file to ${outputFormat}`, async (): Promise<void> => {
        let exception;

        try {
          const inputPath = getInputPath(inputFileName);
          const inputStream = createReadStream(inputPath);

          const outputStream = await libreOfficeFileConverter.convertStream(inputStream, outputFormat);

          const outputPath = getOutputPath(outputFileName);

          await writeFileStreamAsync(outputPath, outputStream);

          const isExists = await access(outputPath);

          expect(isExists).toBe(true);
        } catch (error) {
          exception = error;
        }

        expect(exception).toBe(undefined);
      });
    });

    it('Should throw an error when libreoffice fails to convert file', async (): Promise<void> => {
      let exception;

      try {
        const inputPath = getInputPath('example.pdf');
        const inputStream = createReadStream(inputPath);

        await libreOfficeFileConverter.convertStream(inputStream, 'docx');
      } catch (error) {
        exception = error;
      }

      expect(exception).toContain('Error');
    });
  });
});
