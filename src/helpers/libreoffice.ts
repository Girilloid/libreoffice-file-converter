import { access } from 'node:fs/promises';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

import { DARWIN_PATHS, LINUX_PATHS, WIN32_PATHS } from '../constants';

export const getLibreOfficeExecutablePaths = (): readonly string[] => {
  if (process.platform === 'darwin') {
    return DARWIN_PATHS();
  }

  if (process.platform === 'linux') {
    return LINUX_PATHS();
  }

  if (process.platform === 'win32') {
    return WIN32_PATHS();
  }

  return [];
};

export const getLibreOfficeExecutablePath = async (binaryPaths: readonly string[] = []): Promise<string> => {
  const paths = [...binaryPaths, ...getLibreOfficeExecutablePaths()];

  const existingPaths = await Promise.all(
    paths.map(async (path) => {
      try {
        await access(path);
      } catch {
        return false;
      }

      return path;
    }),
  );

  const [path] = existingPaths.filter(Boolean);

  if (!path) {
    throw new Error('Could not find soffice binary');
  }

  return path;
};

export const getLibreOfficeInitCommandArgs = (installationDir: string): readonly string[] => {
  const args: string[] = [];

  if (installationDir && installationDir.length > 0) {
    args.push(`-env:UserInstallation=${pathToFileURL(installationDir).toString()}`);
  }

  args.push('--headless', '--terminate_after_init');

  return args;
};

export const getLibreOfficeConvertCommandArgs = (
  installationDir: string,
  inputPath: string,
  outputDir: string,
  format: string,
  inputFilter?: string,
  outputFilter?: string,
): readonly string[] => {
  const filterSegment = outputFilter && outputFilter.length > 0 ? `:${outputFilter}` : '';

  const args: string[] = [];

  if (installationDir && installationDir.length > 0) {
    args.push(`-env:UserInstallation=${pathToFileURL(installationDir).toString()}`);
  }

  args.push('--headless');

  if (inputFilter && inputFilter.length > 0) {
    args.push(`--infilter=${inputFilter}`);
  }

  args.push('--convert-to', `${format}${filterSegment}`, '--outdir', outputDir, inputPath);

  return args;
};

export const hasLibreOfficeError = (stderr: string): boolean => {
  return stderr?.toLowerCase()?.includes('error:');
};
