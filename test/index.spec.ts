import { join } from 'path';

import { LibreOfficeFileConverter } from '../src';
import { readFileAsync, writeFileAsync } from '../src/helpers/fs.helpers';

const getResourcesPath = (fileName: string): string => {
  return join(__dirname, '/resources', fileName);
};

const timeout = 10 * 1000;

describe('LibreOfficeFileConverter', () => {
  let libreOfficeFileConverter: LibreOfficeFileConverter;

  beforeAll(() => {
    libreOfficeFileConverter = new LibreOfficeFileConverter({
      childProcessOptions: {
        timeout,
      },
    });
  });

  describe('convert to pdf', () => {
    const format = 'pdf';

    it('Should convert doc file', async () => {
      let exception;

      try {
        const inputPath = getResourcesPath('example.doc');
        const outputPath = getResourcesPath('example-doc.pdf');

        const buffer = await readFileAsync(inputPath);

        const resultBuffer = await libreOfficeFileConverter.convert(buffer, format);

        await writeFileAsync(outputPath, resultBuffer);
      } catch (error) {
        exception = error;
      }

      expect(exception).toBe(undefined);
    });

    it('Should convert docx file', async () => {
      let exception;

      try {
        const inputPath = getResourcesPath('example.docx');
        const outputPath = getResourcesPath('example-docx.pdf');

        const buffer = await readFileAsync(inputPath);

        const resultBuffer = await libreOfficeFileConverter.convert(buffer, format);

        await writeFileAsync(outputPath, resultBuffer);
      } catch (error) {
        exception = error;
      }

      expect(exception).toBe(undefined);
    });

    it('Should convert odp file', async () => {
      let exception;

      try {
        const inputPath = getResourcesPath('example.odp');
        const outputPath = getResourcesPath('example-odp.pdf');

        const buffer = await readFileAsync(inputPath);

        const resultBuffer = await libreOfficeFileConverter.convert(buffer, format);

        await writeFileAsync(outputPath, resultBuffer);
      } catch (error) {
        exception = error;
      }

      expect(exception).toBe(undefined);
    });

    it('Should convert odt file', async () => {
      let exception;

      try {
        const inputPath = getResourcesPath('example.odt');
        const outputPath = getResourcesPath('example-odt.pdf');

        const buffer = await readFileAsync(inputPath);

        const resultBuffer = await libreOfficeFileConverter.convert(buffer, format);

        await writeFileAsync(outputPath, resultBuffer);
      } catch (error) {
        exception = error;
      }

      expect(exception).toBe(undefined);
    });

    it('Should convert ppt file', async () => {
      let exception;

      try {
        const inputPath = getResourcesPath('example.ppt');
        const outputPath = getResourcesPath('example-ppt.pdf');

        const buffer = await readFileAsync(inputPath);

        const resultBuffer = await libreOfficeFileConverter.convert(buffer, format);

        await writeFileAsync(outputPath, resultBuffer);
      } catch (error) {
        exception = error;
      }

      expect(exception).toBe(undefined);
    });

    it('Should convert xls file', async () => {
      let exception;

      try {
        const inputPath = getResourcesPath('example.xls');
        const outputPath = getResourcesPath('example-xls.pdf');

        const buffer = await readFileAsync(inputPath);

        const resultBuffer = await libreOfficeFileConverter.convert(buffer, format);

        await writeFileAsync(outputPath, resultBuffer);
      } catch (error) {
        exception = error;
      }

      expect(exception).toBe(undefined);
    });

    it('Should convert xlsx file', async () => {
      let exception;

      try {
        const inputPath = getResourcesPath('example.xlsx');
        const outputPath = getResourcesPath('example-xlsx.pdf');

        const buffer = await readFileAsync(inputPath);

        const resultBuffer = await libreOfficeFileConverter.convert(buffer, format);

        await writeFileAsync(outputPath, resultBuffer);
      } catch (error) {
        exception = error;
      }

      expect(exception).toBe(undefined);
    });

    it('Should convert jpg file', async () => {
      let exception;

      try {
        const inputPath = getResourcesPath('example.jpg');
        const outputPath = getResourcesPath('example-jpg.pdf');

        const buffer = await readFileAsync(inputPath);

        const resultBuffer = await libreOfficeFileConverter.convert(buffer, format);

        await writeFileAsync(outputPath, resultBuffer);
      } catch (error) {
        exception = error;
      }

      expect(exception).toBe(undefined);
    });

    it('Should convert png file', async () => {
      let exception;

      try {
        const inputPath = getResourcesPath('example.png');
        const outputPath = getResourcesPath('example-png.pdf');

        const buffer = await readFileAsync(inputPath);

        const resultBuffer = await libreOfficeFileConverter.convert(buffer, format);

        await writeFileAsync(outputPath, resultBuffer);
      } catch (error) {
        exception = error;
      }

      expect(exception).toBe(undefined);
    });

    it('Should convert gif file', async () => {
      let exception;

      try {
        const inputPath = getResourcesPath('example.gif');
        const outputPath = getResourcesPath('example-gif.pdf');

        const buffer = await readFileAsync(inputPath);

        const resultBuffer = await libreOfficeFileConverter.convert(buffer, format);

        await writeFileAsync(outputPath, resultBuffer);
      } catch (error) {
        exception = error;
      }

      expect(exception).toBe(undefined);
    });
  });
});
