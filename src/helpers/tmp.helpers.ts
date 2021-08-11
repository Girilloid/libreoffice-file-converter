import { dir, DirOptions, DirResult } from 'tmp';

export const dirAsync = (options: DirOptions): Promise<DirResult> => {
  return new Promise((resolve, reject) => {
    dir(options, (error, name, removeCallback) => {
      if (error) {
        return reject(error);
      }

      return resolve({
        name,
        removeCallback,
      });
    });
  });
};
