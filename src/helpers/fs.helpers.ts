import { access, createWriteStream, readFile, writeFile } from 'fs';
import { pipeline } from 'stream';
import type { Readable } from 'stream';

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

export const writeFileStreamAsync = (path: string, readStream: Readable): Promise<void> => {
  return new Promise((resolve, reject) => {
    const writeStream = createWriteStream(path);

    pipeline(readStream, writeStream, (error) => {
      if (error) {
        return reject(error);
      }

      return resolve();
    });
  });
};
