import { createWriteStream } from 'node:fs';
import { join, parse } from 'node:path';
import type { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

export const getTemporaryFilePath = (temporaryDir: string): string => {
  return join(temporaryDir, 'source');
};

export const getProcessedFilePath = (temporaryDirPath: string, inputPath: string, format: string): string => {
  const insideTemporaryDir = inputPath.startsWith(temporaryDirPath);

  if (insideTemporaryDir) {
    return `${inputPath}.${format}`;
  }

  const { name: inputFileName } = parse(inputPath);

  return join(temporaryDirPath, `${inputFileName}.${format}`);
};

export const writeStream = (path: string, readStream: Readable): Promise<void> => {
  return pipeline(readStream, createWriteStream(path));
};
