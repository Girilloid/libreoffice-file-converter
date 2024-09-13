import { Buffer } from 'node:buffer';
import { execFile } from 'node:child_process';
import type { ExecFileOptions } from 'node:child_process';
import process from 'node:process';
import { inspect } from 'node:util';

import { hasLibreOfficeError } from './libreoffice';

const processOutputToString = (processOutput: string | Buffer): string => {
  return processOutput instanceof Buffer ? processOutput.toString('utf-8') : processOutput;
};

export const execFileAsync = (
  path: string,
  args: readonly string[],
  options?: ExecFileOptions,
  debug?: boolean,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    execFile(path, args, options, (error, stdout, stderr) => {
      const stderrString = processOutputToString(stderr);
      const stdoutString = processOutputToString(stdout);

      if (debug) {
        const debugInfo = inspect(
          {
            args,
            path,
            stderr: stderrString,
            stdout: stdoutString,
          },
          {
            colors: true,
            sorted: true,
          },
        );

        process.stdout.write(`LibreOffice debug output:\n${debugInfo}\n`);
      }

      const libreOfficeError = hasLibreOfficeError(stderrString);

      if (error || libreOfficeError) {
        return reject(error || new Error(stderrString));
      }

      return resolve();
    });
  });
};
