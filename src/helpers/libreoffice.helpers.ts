import { access } from 'node:fs/promises';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

import { DARWIN_PATHS, LINUX_PATHS, WIN32_PATHS } from '../constants/paths';

export const getPaths = (): string[] => {
  if (process.platform === 'darwin') {
    return DARWIN_PATHS();
  }

  if (process.platform === 'linux') {
    return LINUX_PATHS();
  }

  if (process.platform === 'win32') {
    return WIN32_PATHS();
  }

  throw new Error(`Operating system not yet supported: ${process.platform}`);
};

export const getLibreOfficePath = async (binaryPaths: string[]): Promise<string> => {
  const paths = [...binaryPaths, ...getPaths()];

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

export const getLibreOfficeCommandArgs = (
  installationDir: string,
  inputPath: string,
  outputDir: string,
  format: string,
  filter?: string,
): string[] => {
  const filterSegment = filter?.length > 0 ? `:${filter}` : '';
  const formatArg = filter?.includes(' ') ? `"${format}${filterSegment}"` : `${format}${filterSegment}`;

  const args = [
    `-env:UserInstallation=${pathToFileURL(installationDir)}`,
    '--headless',
    '--convert-to',
    formatArg,
    '--outdir',
    outputDir,
    inputPath,
  ];

  return args;
};
