import { join } from 'path';

import { execFileAsync } from './helpers/child-process.helpers';
import { readFileAsync, writeFileAsync } from './helpers/fs.helpers';
import { getLibreOfficeCommand, getLibreOfficePath } from './helpers/libreoffice.helpers';
import { dirAsync } from './helpers/tmp.helpers';
import { LibreOfficeFileConverterOptions } from './libreoffice-file-converter-options.interface';

export class LibreOfficeFileConverter {
  private readonly _childProcessOptions: LibreOfficeFileConverterOptions['childProcessOptions'];

  private readonly _tmpOptions: LibreOfficeFileConverterOptions['tmpOptions'];

  constructor(options: LibreOfficeFileConverterOptions = {}) {
    const { childProcessOptions, tmpOptions } = options;

    this._childProcessOptions = childProcessOptions;
    this._tmpOptions = tmpOptions;
  }

  private getTemporaryFilePath = (temporaryDir: string): string => {
    return join(temporaryDir, 'source');
  };

  public async convert(file: Buffer, format: string, filter?: string): Promise<Buffer> {
    const libreOfficePath = await getLibreOfficePath();

    const temporaryDir = await dirAsync({
      prefix: 'libreoffice-file-converter',
      unsafeCleanup: true,
      ...this._tmpOptions,
    });
    const installationDir = await dirAsync({
      prefix: 'soffice',
      unsafeCleanup: true,
      ...this._tmpOptions,
    });

    const temporaryFilePath = this.getTemporaryFilePath(temporaryDir.name);

    await writeFileAsync(temporaryFilePath, file);

    const libreOfficeCommand = getLibreOfficeCommand(temporaryDir.name, installationDir.name, format, filter);

    await execFileAsync(libreOfficePath, libreOfficeCommand, this._childProcessOptions);

    const result = await readFileAsync(`${temporaryFilePath}.${format}`);

    installationDir.removeCallback();
    temporaryDir.removeCallback();

    return result;
  }
}
