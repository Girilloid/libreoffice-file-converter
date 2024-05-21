import { createWriteStream } from 'node:fs';
import { posix, sep } from 'node:path';
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

export const getFileUri = (path: string): string => {
  if (process.platform === 'win32') {
    const posixPath = path.split(sep).join(posix.sep);

    return `file:///${posixPath}`;
  }

  return `file://${path}`;
};
