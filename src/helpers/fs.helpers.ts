import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream';
import type { Readable } from 'node:stream';

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
