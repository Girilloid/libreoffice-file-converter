import { access as fsAccess, mkdir, readdir, unlink } from 'fs/promises';
import { join } from 'path';

import { LibreOfficeFileConverter } from '../src';
import { readFileAsync, writeFileAsync } from '../src/helpers/fs.helpers';

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
    });
  });

  afterEach(async () => {
    await clearDir(outputDir);
  });

  describe('convertBuffer()', () => {
    formats.map((format) => {
      const inputFileName = `example.${format}`;
      const outputFileName = `example-${format}.${outputFormat}`;

      return it(`Should convert ${format} file to ${outputFormat}`, async (): Promise<void> => {
        let exception;

        try {
          const inputPath = getInputPath(inputFileName);
          const outputPath = getOutputPath(outputFileName);

          const buffer = await readFileAsync(inputPath);

          const resultBuffer = await libreOfficeFileConverter.convert(buffer, outputFormat);

          await writeFileAsync(outputPath, resultBuffer);
        } catch (error) {
          exception = error;
        }

        expect(exception).toBe(undefined);
      });
    });
  });

  describe('convertFile()', () => {
    formats.map((format) => {
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
  });
});
