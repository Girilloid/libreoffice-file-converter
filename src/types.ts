import type { ExecFileOptions } from 'node:child_process';
import type { Buffer } from 'node:buffer';
import type { Readable } from 'node:stream';
import type { DirOptions } from 'tmp';

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
   * tmp-promise options.
   */
  readonly tmpOptions?: DirOptions;
};

export type ConvertInputOptions =
  | {
      /**
       * Input buffer.
       */
      readonly buffer: Buffer;

      /**
       * Input as a buffer.
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

export type ConvertOutputOptionsBuffer = {
  /**
   * Return conversion result as a buffer.
   */
  readonly output: 'buffer';
};

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

export type ConvertOutputOptionsStream = {
  /**
   * Return conversion result as a readable stream.
   */
  readonly output: 'stream';
};

export type ConvertOutputOptions = ConvertOutputOptionsBuffer | ConvertOutputOptionsFile | ConvertOutputOptionsStream;

export type ConvertOptionsInput = ConvertInputOptions & {
  /**
   * LibreOffice convert filter.
   */
  readonly filter?: string;

  /**
   * Requested format.
   */
  readonly format: string;

  /**
   * LibreOfficeConverter options.
   */
  readonly options?: LibreOfficeFileConverterOptions;
};

export type ConvertOptions = ConvertOptionsInput & ConvertOutputOptions;
