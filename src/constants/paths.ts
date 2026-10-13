import { join } from 'node:path';
import process from 'node:process';

import { PROGRAM_FILES, PROGRAM_FILES_86 } from './env';

export const DARWIN_PATHS = (): readonly string[] => ['/Applications/LibreOffice.app/Contents/MacOS/soffice'];

export const LINUX_PATHS = (): readonly string[] => [
  '/usr/bin/libreoffice',
  '/usr/bin/soffice',
  '/snap/bin/libreoffice',
  '/opt/libreoffice/program/soffice',
  '/opt/libreoffice7.6/program/soffice',
];

export const WIN32_PATHS = (): readonly string[] => {
  const paths: string[] = [];

  const programFiles86 = process.env[PROGRAM_FILES_86];

  if (programFiles86) {
    paths.push(join(programFiles86, 'LIBREO~1/program/soffice.exe'));
    paths.push(join(programFiles86, 'LibreOffice/program/soffice.exe'));
  }

  const programFiles = process.env[PROGRAM_FILES];

  if (programFiles) {
    paths.push(join(programFiles, 'LibreOffice/program/soffice.exe'));
  }

  return paths;
};
