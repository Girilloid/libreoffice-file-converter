import { constants } from 'node:fs';
import { access } from 'node:fs/promises';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

import { DARWIN_PATHS, LINUX_PATHS, WIN32_PATHS } from '../constants';

export const getLibreOfficeExecutablePaths = (): readonly string[] => {
  if (process.platform === 'darwin') {
    return DARWIN_PATHS;
  }

  if (process.platform === 'linux') {
    return LINUX_PATHS;
  }

  if (process.platform === 'win32') {
    return WIN32_PATHS();
  }

  return [];
};

const resolveLibreOfficeExecutablePath = async (binaryPaths: readonly string[]): Promise<string> => {
  const paths = [...binaryPaths, ...getLibreOfficeExecutablePaths()];

  const existingPaths = await Promise.all(
    paths.map(async (path) => {
      try {
        await access(path, constants.X_OK);
      } catch {
        return false;
      }

      return path;
    }),
  );

  const path = existingPaths.find((candidate): candidate is string => typeof candidate === 'string');

  if (!path) {
    throw new Error('Could not find soffice binary');
  }

  return path;
};

const libreOfficeExecutablePathPromises = new Map<string, Promise<string>>();

export const getLibreOfficeExecutablePath = (binaryPaths: readonly string[] = []): Promise<string> => {
  const cacheKey = JSON.stringify(binaryPaths);

  const cachedLibreOfficeExecutablePath = libreOfficeExecutablePathPromises.get(cacheKey);

  if (cachedLibreOfficeExecutablePath) {
    return cachedLibreOfficeExecutablePath;
  }

  const libreOfficeExecutablePathPromise = resolveLibreOfficeExecutablePath(binaryPaths);

  libreOfficeExecutablePathPromises.set(cacheKey, libreOfficeExecutablePathPromise);

  void libreOfficeExecutablePathPromise.catch(() => {
    libreOfficeExecutablePathPromises.delete(cacheKey);
  });

  return libreOfficeExecutablePathPromise;
};

export const getLibreOfficeInitCommandArgs = (installationDir: string): readonly string[] => {
  const args: string[] = [];

  if (installationDir && installationDir.length > 0) {
    args.push(`-env:UserInstallation=${pathToFileURL(installationDir).toString()}`);
  }

  args.push('--headless', '--norestore', '--nolockcheck', '--terminate_after_init');

  return args;
};

const toFilterSegment = (value?: string): string => {
  return value && value.length > 0 ? `:${value}` : '';
};

type GetLibreOfficeConvertCommandArgsParams = {
  readonly convertImagesTo?: string;
  readonly format: string;
  readonly inputFilter?: string;
  readonly inputFilterOptions?: string;
  readonly inputPath: string;
  readonly installationDir: string;
  readonly outputDir: string;
  readonly outputFilter?: string;
  readonly outputFilterOptions?: string | Record<string, unknown>;
};

export const getLibreOfficeConvertCommandArgs = ({
  convertImagesTo,
  format,
  inputFilter,
  inputFilterOptions,
  inputPath,
  installationDir,
  outputDir,
  outputFilter,
  outputFilterOptions,
}: GetLibreOfficeConvertCommandArgsParams): readonly string[] => {
  const inputFilterSegment = toFilterSegment(inputFilterOptions);
  const outputFilterSegment = toFilterSegment(outputFilter);
  const outputFilterOptionsSegment = toFilterSegment(
    typeof outputFilterOptions === 'string' ? outputFilterOptions : JSON.stringify(outputFilterOptions),
  );

  const args: string[] = [];

  if (installationDir && installationDir.length > 0) {
    args.push(`-env:UserInstallation=${pathToFileURL(installationDir).toString()}`);
  }

  args.push('--headless', '--norestore', '--nolockcheck');

  if (inputFilter) {
    args.push(`--infilter=${inputFilter}${inputFilterSegment}`);
  }

  args.push('--convert-to', `${format}${outputFilterSegment}${outputFilterOptionsSegment}`, '--outdir', outputDir);

  if (convertImagesTo) {
    args.push('--convert-images-to', convertImagesTo);
  }

  args.push(inputPath);

  return args;
};

export const hasLibreOfficeError = (stderr: string): boolean => {
  return stderr.toLowerCase().includes('error:');
};
