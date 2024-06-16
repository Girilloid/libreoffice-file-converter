import { ExecFileOptions, execFile } from 'node:child_process';

export const execFileAsync = (
  path: string,
  args: string[],
  options: ExecFileOptions,
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

      const hasLibreOfficeError = stderr?.toLowerCase()?.includes('error:');

      if (error || hasLibreOfficeError) {
        return reject(error || stderr);
      }

      return resolve();
    });
  });
};
