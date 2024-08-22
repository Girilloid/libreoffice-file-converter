import type { Buffer } from 'node:buffer';
import { createReadStream } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { sep } from 'node:path';
import type { Readable } from 'node:stream';
import { dir, setGracefulCleanup } from 'tmp-promise';

import {
  deepMerge,
  execFileAsync,
  getLibreOfficeCommandArgs,
  getLibreOfficeExecutablePath,
  getTemporaryFilePath,
  writeStream,
} from './helpers';
import type {
  ConvertOptions,
  ConvertOptionsInput,
  ConvertOutputOptionsBuffer,
  ConvertOutputOptionsFile,
  ConvertOutputOptionsStream,
  LibreOfficeFileConverterOptions,
} from './types';

/**
 * Simple NodeJS wrapper for libreoffice CLI for converting office documents to different formats.
 *
 * @example
 * ```ts
 * const libreOfficeFileConverter = new LibreOfficeFileConverter({ childProcessOptions: { timeout: 60 * 1000 } });
 * ```
 *
 * @class
 * @public
 */
export class LibreOfficeFileConverter {
  private readonly _options: LibreOfficeFileConverterOptions;

  /**
   * Create an instance of the LibreOfficeFileConverter.
   *
   * @example
   * ```ts
   * const libreOfficeFileConverter = new LibreOfficeFileConverter({ childProcessOptions: { timeout: 60 * 1000 } });
   * ```
   *
   * @param options The LibreOfficeFileConverter options.
   *
   * @constructor
   * @public
   */
  constructor(options: LibreOfficeFileConverterOptions = {}) {
    this._options = options;

    setGracefulCleanup();
  }

  /**
   * Converts provided input to the requested format.
   *
   * @example
   * ```ts
   * const outputBuffer = await libreOfficeFileConverter.convert({
   *  buffer: inputBuffer,
   *  format: 'pdf',
   *  input: 'buffer',
   *  output: 'buffer',
   * });
   * ```
   *
   * @param options Convert options: input and output type, format, filter, converter options.
   *
   * @returns Buffer of the converted input.
   *
   * @overload
   * @public
   */
  public async convert(options: ConvertOptionsInput & ConvertOutputOptionsBuffer): Promise<Buffer>;

  /**
   * Converts provided input to the requested format.
   *
   * @example
   * ```ts
   * await libreOfficeFileConverter.convert({
   *  format: 'pdf',
   *  input: 'file',
   *  inputPath,
   *  output: 'file',
   *  outputPath,
   * });
   * ```
   *
   * @param options Convert options: input and output type, format, filter, converter options.
   *
   * @overload
   * @public
   */
  public async convert(options: ConvertOptionsInput & ConvertOutputOptionsFile): Promise<void>;

  /**
   * Converts provided input to the requested format.
   *
   * @example
   * ```ts
   * const outputStream = await libreOfficeFileConverter.convert({
   *  format: 'pdf',
   *  input: 'stream',
   *  stream: inputStream,
   *  output: 'stream',
   * });
   * ```
   *
   * @param options Convert options: input and output type, format, filter, converter options.
   *
   * @returns Readable stream of the converted input.
   *
   * @overload
   * @public
   */
  public async convert(options: ConvertOptionsInput & ConvertOutputOptionsStream): Promise<Readable>;

  /**
   * Converts provided input to the requested format.
   *
   * @example
   * ```ts
   * const outputBuffer = await libreOfficeFileConverter.convert({
   *  buffer: inputBuffer,
   *  format: 'pdf',
   *  input: 'buffer',
   *  output: 'buffer',
   * });
   * ```
   *
   * @param options Convert options: input and output type, format, filter, converter options.
   *
   * @returns Buffer, readable stream or void depending on the convert options.
   *
   * @public
   */
  public async convert(options: ConvertOptions): Promise<Buffer | Readable | void> {
    const { format, filter, options: callOptions = {} } = options;

    const mergedOptions = this.mergeOptions(callOptions);
    const { tmpOptions } = mergedOptions;

    const temporaryDir = await dir({
      prefix: 'libreoffice-file-converter',
      unsafeCleanup: true,
      ...tmpOptions,
    });

    try {
      const inputPath = await this.write(options, temporaryDir.path);

      await this.process(inputPath, temporaryDir.path, format, filter, mergedOptions);

      const result = await this.read(options, temporaryDir.path, inputPath);

      temporaryDir.cleanup();

      return result;
    } catch (error) {
      await temporaryDir.cleanup();

      throw error;
    }
  }

  private getProcessedFilePath(temporaryDirPath: string, inputPath: string, format: string): string {
    const insideTemporaryDir = inputPath.startsWith(temporaryDirPath);

    if (insideTemporaryDir) {
      return `${inputPath}.${format}`;
    }

    const inputFileNameSegment = inputPath.split(sep).at(-1);
    const inputFileNameSegments = inputFileNameSegment?.split('.');

    const inputFileName = inputFileNameSegments?.slice(0, -1).join('.');

    return `${temporaryDirPath}${sep}${inputFileName}.${format}`;
  }

  private mergeOptions(options: LibreOfficeFileConverterOptions = {}): LibreOfficeFileConverterOptions {
    return deepMerge(this._options, options);
  }

  private async process(
    inputPath: string,
    outputDir: string,
    format: string,
    filter?: string,
    options: LibreOfficeFileConverterOptions = {},
  ): Promise<void> {
    const { binaryPaths, childProcessOptions, debug, tmpOptions } = options;

    const libreOfficeExecutablePath = await getLibreOfficeExecutablePath(binaryPaths);

    const installationDir = await dir({
      prefix: 'soffice',
      unsafeCleanup: true,
      ...tmpOptions,
    });

    const libreOfficeCommandArgs = getLibreOfficeCommandArgs(
      installationDir.path,
      inputPath,
      outputDir,
      format,
      filter,
    );

    try {
      await execFileAsync(libreOfficeExecutablePath, libreOfficeCommandArgs, childProcessOptions, debug);

      installationDir.cleanup();
    } catch (error) {
      await installationDir.cleanup();

      throw error;
    }
  }

  private async read(
    options: ConvertOptions,
    temporaryDirPath: string,
    inputPath: string,
  ): Promise<Buffer | Readable | void> {
    const { format, output } = options;

    const processedFilePath = this.getProcessedFilePath(temporaryDirPath, inputPath, format);

    if (output === 'buffer') {
      return readFile(processedFilePath);
    }

    if (output === 'file') {
      const { outputPath } = options;

      const stream = createReadStream(processedFilePath);

      return writeStream(outputPath, stream);
    }

    if (output === 'stream') {
      return createReadStream(processedFilePath);
    }
  }

  private async write(options: ConvertOptions, temporaryDirPath: string): Promise<string> {
    const { input } = options;

    const temporaryFilePath = getTemporaryFilePath(temporaryDirPath);

    if (input === 'buffer') {
      const { buffer } = options;

      await writeFile(temporaryFilePath, buffer);

      return temporaryFilePath;
    }

    if (input === 'file') {
      const { inputPath } = options;

      return inputPath;
    }

    if (input === 'stream') {
      const { stream } = options;

      await writeStream(temporaryFilePath, stream);

      return temporaryFilePath;
    }

    return temporaryFilePath;
  }
}
