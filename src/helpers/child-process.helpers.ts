import { execFile, ExecFileOptions } from 'child_process';

export const execFileAsync = (path: string, args: string[], options: ExecFileOptions): Promise<void> => {
  return new Promise((resolve, reject) => {
    execFile(path, args, options, (error) => {
      if (error) {
        return reject(error);
      }

      return resolve();
    });
  });
};
