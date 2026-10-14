import type { Buffer } from 'node:buffer';
import type { ExecFileOptions } from 'node:child_process';
import type { Readable } from 'node:stream';

import type { DirOptions } from 'tmp';

/**
 * LibreOfficeFileConverter options.
 */
export type LibreOfficeFileConverterOptions = {
  /**
   * Paths to the soffice binary.
   * Tried in order before the platform default paths.
   */
  readonly binaryPaths?: string[];

  /**
   * node:child_process execFile options.
   */
  readonly childProcessOptions?: ExecFileOptions;

  /**
   * Prints each soffice call (path, args, execution time, stdout, stderr) to stdout.
   */
  readonly debug?: boolean;

  /**
   * User installation (profile) directory for LibreOffice.
   *
   * - `default` - Uses the default user installation directory.
   * - `dynamic` - Creates a temporary user installation directory for each conversion process.
   * - string - Specifies a custom path for the user installation directory.
   */
  readonly installationDir?: InstallationDir;

  /**
   * tmp-promise options for both temporary directories: the conversion directory and,
   * with `dynamic` installationDir, the profile directory.
   */
  readonly tmpOptions?: DirOptions;
};

/**
 * User installation (profile) directory for LibreOffice.
 *
 * - `default` - Uses the default user installation directory.
 * - `dynamic` - Creates a temporary user installation directory for each conversion process.
 * - string - Specifies a custom path for the user installation directory.
 */
export type InstallationDir = 'default' | 'dynamic' | (string & {});

export type ResolvedInstallationDir = {
  readonly cleanup?: () => Promise<void>;
  readonly path: string;
};

/**
 * Convert input options.
 */
export type ConvertInputOptions =
  | {
      /**
       * Input Buffer.
       */
      readonly buffer: Buffer;

      /**
       * Input as a Buffer.
       */
      readonly input: 'buffer';
    }
  | {
      /**
       * Input as a file path.
       */
      readonly input: 'file';

      /**
       * Input file path.
       */
      readonly inputPath: string;
    }
  | {
      /**
       * Input as a readable stream.
       */
      readonly input: 'stream';

      /**
       * Input readable stream.
       */
      readonly stream: Readable;
    };

/**
 * Convert output options.
 */
export type ConvertOutputOptionsBuffer = {
  /**
   * Return conversion result as a Buffer.
   */
  readonly output: 'buffer';
};

/**
 * Convert output options.
 */
export type ConvertOutputOptionsFile = {
  /**
   * Save conversion result as a file.
   */
  readonly output: 'file';

  /**
   * Conversion result path.
   */
  readonly outputPath: string;
};

/**
 * Convert output options.
 */
export type ConvertOutputOptionsStream = {
  /**
   * Return conversion result as a readable stream.
   */
  readonly output: 'stream';
};

/**
 * Convert output options.
 */
export type ConvertOutputOptions = ConvertOutputOptionsBuffer | ConvertOutputOptionsFile | ConvertOutputOptionsStream;

/**
 * Convert options.
 */
export type ConvertOptionsInput = ConvertInputOptions & {
  /**
   * LibreOffice `--convert-images-to` value. Target filter for all images written to the output format.
   * See LibreOffice [docs](https://help.libreoffice.org/latest/en-US/text/shared/guide/start_parameters.html)
   */
  readonly convertImagesTo?: string;

  /**
   * LibreOffice output filter.
   * See LibreOffice [docs](https://help.libreoffice.org/latest/en-US/text/shared/guide/convertfilters.html)
   *
   * @deprecated Use `outputFilter` instead.
   */
  readonly filter?: string;

  /**
   * Requested format.
   */
  readonly format: string;

  /**
   * LibreOffice input filter.
   * See LibreOffice [docs](https://help.libreoffice.org/latest/en-US/text/shared/guide/convertfilters.html)
   */
  readonly inputFilter?: string;

  /**
   * LibreOffice input filter options, the `--infilter` FilterParams segment. Requires `inputFilter`.
   * See LibreOffice [docs](https://help.libreoffice.org/latest/en-US/text/shared/guide/convertfilters.html)
   */
  readonly inputFilterOptions?: string;

  /**
   * Merged with the instance options for this call.
   * Array options concatenate.
   */
  readonly options?: LibreOfficeFileConverterOptions;

  /**
   * LibreOffice output filter.
   * See LibreOffice [docs](https://help.libreoffice.org/latest/en-US/text/shared/guide/convertfilters.html)
   */
  readonly outputFilter?: string;

  /**
   * LibreOffice output filter options, the third `--convert-to` segment.
   * An object is JSON-stringified; a string is passed as is. Requires `outputFilter`.
   * See LibreOffice [docs](https://help.libreoffice.org/latest/en-US/text/shared/guide/pdf_params.html)
   */
  readonly outputFilterOptions?: string | Record<string, unknown>;
};

/**
 * Convert options.
 */
export type ConvertOptions = ConvertOptionsInput & ConvertOutputOptions;

/**
 * Init options.
 */
export type InitOptions = {
  /**
   * User installation (profile) directory for LibreOffice.
   */
  readonly installationDir: string;

  /**
   * Merged with the instance options for this call.
   * Array options concatenate.
   */
  readonly options?: LibreOfficeFileConverterOptions;
};

export type GetInstallationDirParams = {
  readonly installationDir?: InstallationDir;
  readonly options: LibreOfficeFileConverterOptions;
};

export type ProcessParams = {
  readonly convertImagesTo?: string;
  readonly format: string;
  readonly inputFilter?: string;
  readonly inputFilterOptions?: string;
  readonly inputPath: string;
  readonly options: LibreOfficeFileConverterOptions;
  readonly outputDir: string;
  readonly outputFilter?: string;
  readonly outputFilterOptions?: string | Record<string, unknown>;
};

export type ReadParams = {
  readonly inputPath: string;
  readonly options: ConvertOptions;
  readonly temporaryDirPath: string;
};

export type WriteParams = {
  readonly options: ConvertOptions;
  readonly temporaryDirPath: string;
};
