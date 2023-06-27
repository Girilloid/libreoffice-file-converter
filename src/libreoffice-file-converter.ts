import { join } from 'path';

import { execFileAsync } from './helpers/child-process.helpers';
import { readFileAsync, writeFileAsync } from './helpers/fs.helpers';
import { getLibreOfficeCommand, getLibreOfficePath } from './helpers/libreoffice.helpers';
import { dirAsync } from './helpers/tmp.helpers';
import type { LibreOfficeFileConverterOptions } from './libreoffice-file-converter-options.interface';

/**
 * Simple NodeJS wrapper for libreoffice CLI for converting office documents to different formats.
 *
 * @class
 */
export class LibreOfficeFileConverter {
  private readonly _binaryPaths: LibreOfficeFileConverterOptions['binaryPaths'];

  private readonly _childProcessOptions: LibreOfficeFileConverterOptions['childProcessOptions'];

  private readonly _tmpOptions: LibreOfficeFileConverterOptions['tmpOptions'];

  /**
   * Create an instance of the LibreOfficeFileConverter.
   *
   * @constructor
   *
   * @param {LibreOfficeFileConverterOptions=} [options={}] - The LibreOfficeFileConverter options.
   */
  constructor(options: LibreOfficeFileConverterOptions = {}) {
    const { binaryPaths = [], childProcessOptions, tmpOptions } = options;

    this._binaryPaths = binaryPaths;
    this._childProcessOptions = childProcessOptions;
    this._tmpOptions = tmpOptions;
  }

  private getTemporaryFilePath = (temporaryDir: string): string => {
    return join(temporaryDir, 'source');
  };

  /**
   * Converts the provided file Buffer to the requested format.
   *
   * @async
   * @public
   *
   * @param {Buffer} file - The input file Buffer.
   * @param {string} format - The file format to convert to.
   * @param {string=} filter - See LibreOffice docs about filter.
   *
   * @returns {Buffer} - The output file Buffer.
   */
  public async convert(file: Buffer, format: string, filter?: string): Promise<Buffer> {
    return this.convertBuffer(file, format, filter);
  }

  /**
   * Converts the provided file Buffer to the requested format.
   *
   * @async
   * @public
   *
   * @param {Buffer} file - The input file Buffer.
   * @param {string} format - The file format to convert to.
   * @param {string=} filter - See LibreOffice docs about filter.
   *
   * @returns {Promise<Buffer>} - The output file Buffer.
   */
  public async convertBuffer(file: Buffer, format: string, filter?: string): Promise<Buffer> {
    const temporaryDir = await dirAsync({
      prefix: 'libreoffice-file-converter',
      unsafeCleanup: true,
      ...this._tmpOptions,
    });

    const temporaryFilePath = this.getTemporaryFilePath(temporaryDir.name);

    await writeFileAsync(temporaryFilePath, file);

    await this.convertFile(temporaryFilePath, temporaryDir.name, format, filter);

    const result = await readFileAsync(`${temporaryFilePath}.${format}`);

    temporaryDir.removeCallback();

    return result;
  }

  /**
   * Converts the provided file to the requested format.
   *
   * @async
   * @public
   *
   * @param {string} inputPath - The path to the input file within file system.
   * @param {string} outputDir - The output directory path within file system.
   * @param {string} format - The file format to convert to.
   * @param {string=} filter - See LibreOffice docs about filter.
   */
  public async convertFile(inputPath: string, outputDir: string, format: string, filter?: string): Promise<void> {
    const libreOfficePath = await getLibreOfficePath(this._binaryPaths);

    const installationDir = await dirAsync({
      prefix: 'soffice',
      unsafeCleanup: true,
      ...this._tmpOptions,
    });

    const libreOfficeCommand = getLibreOfficeCommand(installationDir.name, inputPath, outputDir, format, filter);

    await execFileAsync(libreOfficePath, libreOfficeCommand, this._childProcessOptions);

    installationDir.removeCallback();
  }
}
