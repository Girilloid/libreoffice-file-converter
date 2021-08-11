import { ExecFileOptions } from 'child_process';
import { DirOptions } from 'tmp';

export interface LibreOfficeFileConverterOptions {
  childProcessOptions?: ExecFileOptions;
  tmpOptions?: DirOptions;
}
