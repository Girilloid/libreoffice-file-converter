import type { Buffer } from 'node:buffer';
import { createReadStream } from 'node:fs';
import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { Readable } from 'node:stream';

import { dir, setGracefulCleanup } from 'tmp-promise';

import {
  deepMerge,
  execFileAsync,
  getLibreOfficeConvertCommandArgs,
  getLibreOfficeExecutablePath,
  getLibreOfficeInitCommandArgs,
  getProcessedFilePath,
  getTemporaryFilePath,
  writeStream,
} from './helpers';
import type {
  ConvertOptions,
  ConvertOptionsInput,
  ConvertOutputOptionsBuffer,
  ConvertOutputOptionsFile,
  ConvertOutputOptionsStream,
  GetInstallationDirParams,
  InitOptions,
  LibreOfficeFileConverterOptions,
  ProcessParams,
  ReadParams,
  ResolvedInstallationDir,
  WriteParams,
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
  readonly #options: LibreOfficeFileConverterOptions;

  /**
   * Create an instance of the LibreOfficeFileConverter.
   *
   * @example
   * ```ts
   * const libreOfficeFileConverter = new LibreOfficeFileConverter({ childProcessOptions: { timeout: 60 * 1000 } });
   * ```
   *
   * @param options The LibreOfficeFileConverter options. Defaults for all `convert` and `init` calls.
   *
   * @constructor
   * @public
   */
  constructor(options: LibreOfficeFileConverterOptions = {}) {
    this.#options = options;

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
   * @param options Convert options with `input: 'buffer'` and `output: 'buffer'`.
   *
   * @returns Buffer of the converted input.
   *
   * @throws When the soffice binary is not found, or LibreOffice reports an error.
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
   * @param options Convert options with `output: 'file'`. Requires `outputPath`.
   *
   * @throws When the soffice binary is not found, or LibreOffice reports an error.
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
   * @param options Convert options with `output: 'stream'`. Temporary files are removed after the returned stream closes.
   *
   * @returns Readable stream of the converted input.
   *
   * @throws When the soffice binary is not found, or LibreOffice reports an error.
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
   * @param options Convert options.
   *
   * @returns Buffer, readable stream or void depending on the convert options.
   *
   * @throws When the soffice binary is not found, or LibreOffice reports an error.
   *
   * @public
   */
  public async convert(options: ConvertOptions): Promise<Buffer | Readable | void> {
    const {
      convertImagesTo,
      filter,
      format,
      inputFilter,
      inputFilterOptions,
      options: callOptions = {},
      output,
      outputFilter,
      outputFilterOptions,
    } = options;

    const mergedOptions = this.mergeOptions(callOptions);
    const { tmpOptions } = mergedOptions;

    const temporaryDir = await dir({
      prefix: 'libreoffice-file-converter',
      unsafeCleanup: true,
      ...tmpOptions,
    });

    let isCleanupDeferred = false;

    try {
      const inputPath = await this.write({
        options,
        temporaryDirPath: temporaryDir.path,
      });

      await this.process({
        convertImagesTo,
        format,
        inputFilter,
        inputFilterOptions,
        inputPath,
        options: mergedOptions,
        outputDir: temporaryDir.path,
        outputFilter: outputFilter || filter,
        outputFilterOptions,
      });

      const result = await this.read({
        inputPath,
        options,
        temporaryDirPath: temporaryDir.path,
      });

      if (output === 'stream' && result instanceof Readable) {
        result.once('close', () => {
          void temporaryDir.cleanup().catch(() => undefined);
        });

        isCleanupDeferred = true;
      }

      return result;
    } finally {
      if (!isCleanupDeferred) {
        await temporaryDir.cleanup().catch(() => undefined);
      }
    }
  }

  /**
   * Initializes LibreOffice installation dir by starting executable in headless mode and then terminating it.
   *
   * @example
   * ```ts
   * await libreOfficeFileConverter.init({ installationDir: '/home/user/custom-soffice-profile' });
   * ```
   *
   * @param options Init options.
   *
   * @throws When the soffice binary is not found, or LibreOffice reports an error.
   *
   * @public
   */
  public async init(options: InitOptions): Promise<void> {
    const { installationDir, options: callOptions = {} } = options;

    const mergedOptions = this.mergeOptions(callOptions);
    const { binaryPaths, childProcessOptions, debug } = mergedOptions;

    const libreOfficeExecutablePath = await getLibreOfficeExecutablePath(binaryPaths);

    const libreOfficeCommandArgs = getLibreOfficeInitCommandArgs(installationDir);

    await execFileAsync({
      args: libreOfficeCommandArgs,
      debug,
      options: childProcessOptions,
      path: libreOfficeExecutablePath,
    });
  }

  private async getInstallationDir({
    installationDir = 'dynamic',
    options,
  }: GetInstallationDirParams): Promise<ResolvedInstallationDir> {
    if (installationDir === 'default') {
      return { path: '' };
    }

    if (installationDir === 'dynamic') {
      const { tmpOptions } = options;

      const temporaryDir = await dir({
        prefix: 'soffice',
        unsafeCleanup: true,
        ...tmpOptions,
      });

      return {
        cleanup: () => temporaryDir.cleanup(),
        path: temporaryDir.path,
      };
    }

    return { path: installationDir };
  }

  private mergeOptions(options: LibreOfficeFileConverterOptions = {}): LibreOfficeFileConverterOptions {
    return deepMerge(this.#options, options);
  }

  private async process({
    convertImagesTo,
    format,
    inputFilter,
    inputFilterOptions,
    inputPath,
    options,
    outputDir,
    outputFilter,
    outputFilterOptions,
  }: ProcessParams): Promise<void> {
    const { binaryPaths, childProcessOptions, debug } = options;

    const libreOfficeExecutablePath = await getLibreOfficeExecutablePath(binaryPaths);

    const { cleanup: installationDirCleanup, path: installationDir } = await this.getInstallationDir({
      installationDir: options.installationDir,
      options,
    });

    try {
      const libreOfficeCommandArgs = getLibreOfficeConvertCommandArgs({
        convertImagesTo,
        format,
        inputFilter,
        inputFilterOptions,
        inputPath,
        installationDir,
        outputDir,
        outputFilter,
        outputFilterOptions,
      });

      await execFileAsync({
        args: libreOfficeCommandArgs,
        debug,
        options: childProcessOptions,
        path: libreOfficeExecutablePath,
      });
    } finally {
      await installationDirCleanup?.().catch(() => undefined);
    }
  }

  private async read({ inputPath, options, temporaryDirPath }: ReadParams): Promise<Buffer | Readable | void> {
    const { format, output } = options;

    const processedFilePath = getProcessedFilePath({
      format,
      inputPath,
      temporaryDirPath,
    });

    if (output === 'buffer') {
      return readFile(processedFilePath);
    }

    if (output === 'file') {
      const { outputPath } = options;

      await copyFile(processedFilePath, outputPath);

      return;
    }

    if (output === 'stream') {
      return createReadStream(processedFilePath);
    }

    throw new Error(`Unsupported output type: ${String(output)}`);
  }

  private async write({ options, temporaryDirPath }: WriteParams): Promise<string> {
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

      await writeStream({
        path: temporaryFilePath,
        readStream: stream,
      });

      return temporaryFilePath;
    }

    throw new Error(`Unsupported input type: ${String(input)}`);
  }
}
