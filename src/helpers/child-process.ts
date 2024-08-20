import { Buffer } from 'node:buffer';
import { execFile } from 'node:child_process';
import type { ExecFileOptions } from 'node:child_process';

import { hasLibreOfficeError } from './libreoffice';

export const execFileAsync = (
  path: string,
  args: readonly string[],
  options?: ExecFileOptions,
  debug?: boolean,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    execFile(path, args, options, (error, stdout, stderr) => {
      if (debug) {
        // eslint-disable-next-line no-console
        console.log('LibreOffice debug output', {
          args,
          path,
          stderr,
          stdout,
        });
      }

      const stderrText = stderr instanceof Buffer ? stderr.toString('utf-8') : stderr;

      const libreOfficeError = hasLibreOfficeError(stderrText);

      if (error || libreOfficeError) {
        return reject(error || new Error(stderrText));
      }

      return resolve();
    });
  });
};
