import { join } from 'path';

import { DARWIN_PATHS, LINUX_PATHS, WIN32_PATHS } from '../constants/paths';

import { accessAsync } from './fs.helpers';

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

export const getLibreOfficePath = async (): Promise<string> => {
  const paths = getPaths();

  const existingPaths = await Promise.all(
    paths.map(async (path) => {
      const exists = await accessAsync(path);

      if (!exists) {
        return null;
      }

      return path;
    }),
  );

  const [path] = existingPaths.filter((path) => path);

  if (!path) {
    throw new Error('Could not find soffice binary');
  }

  return path;
};

export const getLibreOfficeCommand = (
  temporaryDir: string,
  installationDir: string,
  format: string,
  filter?: string,
): string[] => {
  let command = `-env:UserInstallation=file://${installationDir} --headless --convert-to ${format}`;

  if (filter) {
    command = `${command}:"${filter}"`;
  }

  command = `${command}  --outdir ${temporaryDir} ${join(temporaryDir, 'source')}`;

  return command.split(' ');
};
