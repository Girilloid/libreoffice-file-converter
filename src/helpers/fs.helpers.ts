import { access, readFile, writeFile } from 'fs';

export const accessAsync = (path: string): Promise<boolean> => {
  return new Promise((resolve) => {
    access(path, (error) => {
      return resolve(!error);
    });
  });
};

export const readFileAsync = (path: string): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    readFile(path, (error, data) => {
      if (error) {
        return reject(error);
      }

      return resolve(data);
    });
  });
};

export const writeFileAsync = (path: string, data: Buffer): Promise<void> => {
  return new Promise((resolve, reject) => {
    writeFile(path, data, (error) => {
      if (error) {
        return reject(error);
      }

      return resolve();
    });
  });
};
