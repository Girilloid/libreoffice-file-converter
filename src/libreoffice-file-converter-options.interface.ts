import { ExecFileOptions } from 'child_process';
import { DirOptions } from 'tmp';

export interface LibreOfficeFileConverterOptions {
  binaryPaths?: string[];
  childProcessOptions?: ExecFileOptions;
  tmpOptions?: DirOptions;
}
