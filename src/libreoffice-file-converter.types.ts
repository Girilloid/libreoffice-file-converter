import type { ExecFileOptions } from 'child_process';
import type { DirOptions } from 'tmp';

export interface LibreOfficeFileConverterOptions {
  binaryPaths?: string[];
  childProcessOptions?: ExecFileOptions;
  debug?: boolean;
  tmpOptions?: DirOptions;
}
