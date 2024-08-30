import { getProcessedFilePath } from '../src/helpers/fs';

describe('helpers/fs', () => {
  describe('getProcessedFilePath', () => {
    const format = 'pdf';
    const temporaryDirPath = '/tmp/libreoffice-file-converter';

    it('returns correct file path for files inside temporary dir', () => {
      const inputPath = `${temporaryDirPath}/source`;

      const result = getProcessedFilePath(temporaryDirPath, inputPath, format);

      expect(result).toBe('/tmp/libreoffice-file-converter/source.pdf');
    });

    it('returns correct file path for files outside temporary dir', () => {
      const inputPath = '/home/user/source.doc';

      const result = getProcessedFilePath(temporaryDirPath, inputPath, format);

      expect(result).toBe('/tmp/libreoffice-file-converter/source.pdf');
    });

    it('returns correct file path for files outside temporary dir with extra dots in file name', () => {
      const inputPath = '/home/user/source.to.process.doc';

      const result = getProcessedFilePath(temporaryDirPath, inputPath, format);

      expect(result).toBe('/tmp/libreoffice-file-converter/source.to.process.pdf');
    });

    it('returns correct file path for files outside temporary dir without extension', () => {
      const inputPath = '/home/user/source';

      const result = getProcessedFilePath(temporaryDirPath, inputPath, format);

      expect(result).toBe('/tmp/libreoffice-file-converter/source.pdf');
    });
  });
});
