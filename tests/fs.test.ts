import { sep } from 'node:path';

import { assertEquals } from 'jsr:@std/assert';
import { describe, it } from 'jsr:@std/testing/bdd';

import { getProcessedFilePath } from '../src/helpers/fs';

describe('helpers/fs', () => {
  describe('getProcessedFilePath', () => {
    const format = 'pdf';
    const temporaryDirPath = ['tmp', 'libreoffice-file-converter'].join(sep);

    it('returns correct file path for files inside temporary dir', () => {
      const inputPath = [temporaryDirPath, 'source'].join(sep);

      const result = getProcessedFilePath(temporaryDirPath, inputPath, format);

      assertEquals(result, ['tmp', 'libreoffice-file-converter', 'source.pdf'].join(sep));
    });

    it('returns correct file path for files outside temporary dir', () => {
      const inputPath = ['home', 'user', 'source.doc'].join(sep);

      const result = getProcessedFilePath(temporaryDirPath, inputPath, format);

      assertEquals(result, ['tmp', 'libreoffice-file-converter', 'source.pdf'].join(sep));
    });

    it('returns correct file path for files outside temporary dir with extra dots in file name', () => {
      const inputPath = ['home', 'user', 'source.to.process.doc'].join(sep);

      const result = getProcessedFilePath(temporaryDirPath, inputPath, format);

      assertEquals(result, ['tmp', 'libreoffice-file-converter', 'source.to.process.pdf'].join(sep));
    });

    it('returns correct file path for files outside temporary dir without extension', () => {
      const inputPath = ['home', 'user', 'source'].join(sep);

      const result = getProcessedFilePath(temporaryDirPath, inputPath, format);

      assertEquals(result, ['tmp', 'libreoffice-file-converter', 'source.pdf'].join(sep));
    });
  });
});
