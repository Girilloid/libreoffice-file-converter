import { ExecFileOptions, execFile } from 'node:child_process';

export const execFileAsync = (path: string, args: string[], options: ExecFileOptions): Promise<void> => {
  return new Promise((resolve, reject) => {
    execFile(path, args, options, (error, stdout, stderr) => {
      const hasLibreOfficeError = stderr?.toLowerCase()?.includes('error');

      if (error || hasLibreOfficeError) {
        return reject(error || stderr);
      }

      return resolve();
    });
  });
};
