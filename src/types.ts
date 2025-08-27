import type { ExecFileOptions } from 'node:child_process';
import type { Buffer } from 'node:buffer';
import type { Readable } from 'node:stream';
import type { DirOptions } from 'tmp';

/**
 * LibreOfficeFileConverter options.
 */
export type LibreOfficeFileConverterOptions = {
  /**
   * List of paths to soffice binary.
   */
  readonly binaryPaths?: string[];

  /**
   * node:child_process execFile options.
   */
  readonly childProcessOptions?: ExecFileOptions;

  /**
   * Enables debug logs on soffice calls.
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
   * tmp-promise options.
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
   * LibreOfficeConverter options.
   */
  readonly options?: LibreOfficeFileConverterOptions;

  /**
   * LibreOffice output filter.
   * See LibreOffice [docs](https://help.libreoffice.org/latest/en-US/text/shared/guide/convertfilters.html)
   */
  readonly outputFilter?: string;
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
   * LibreOfficeConverter options.
   */
  readonly options?: LibreOfficeFileConverterOptions;
};
