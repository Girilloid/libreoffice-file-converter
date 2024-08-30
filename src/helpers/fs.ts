import { createWriteStream } from 'node:fs';
import { join, sep } from 'node:path';
import { pipeline } from 'node:stream';
import type { Readable } from 'node:stream';

export const getTemporaryFilePath = (temporaryDir: string): string => {
  return join(temporaryDir, 'source');
};

export const getProcessedFilePath = (temporaryDirPath: string, inputPath: string, format: string): string => {
  const insideTemporaryDir = inputPath.startsWith(temporaryDirPath);

  if (insideTemporaryDir) {
    return `${inputPath}.${format}`;
  }

  const inputPathSegments = inputPath.split(sep);
  const inputFileNameSegment =
    inputPathSegments.length > 0 ? inputPathSegments[inputPathSegments.length - 1] : inputPathSegments[0];
  const inputFileNameSegments = inputFileNameSegment?.split('.');

  const inputFileName =
    inputFileNameSegments?.length && inputFileNameSegments.length > 1
      ? inputFileNameSegments?.slice(0, -1).join('.')
      : inputFileNameSegments?.[0];

  return `${temporaryDirPath}${sep}${inputFileName}.${format}`;
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
