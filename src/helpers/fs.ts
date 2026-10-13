import { createWriteStream } from 'node:fs';
import { join, parse } from 'node:path';
import type { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

export const getTemporaryFilePath = (temporaryDir: string): string => {
  return join(temporaryDir, 'source');
};

type GetProcessedFilePathParams = {
  readonly format: string;
  readonly inputPath: string;
  readonly temporaryDirPath: string;
};

export const getProcessedFilePath = ({ format, inputPath, temporaryDirPath }: GetProcessedFilePathParams): string => {
  const insideTemporaryDir = inputPath.startsWith(temporaryDirPath);

  if (insideTemporaryDir) {
    return `${inputPath}.${format}`;
  }

  const { name: inputFileName } = parse(inputPath);

  return join(temporaryDirPath, `${inputFileName}.${format}`);
};

type WriteStreamParams = {
  readonly path: string;
  readonly readStream: Readable;
};

export const writeStream = ({ path, readStream }: WriteStreamParams): Promise<void> => {
  return pipeline(readStream, createWriteStream(path));
};
