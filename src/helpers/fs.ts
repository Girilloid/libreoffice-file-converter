import { createWriteStream } from 'node:fs';
import { join } from 'node:path';
import { pipeline } from 'node:stream';
import type { Readable } from 'node:stream';

export const getTemporaryFilePath = (temporaryDir: string): string => {
  return join(temporaryDir, 'source');
};

export const writeStream = (path: string, readStream: Readable): Promise<void> => {
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
