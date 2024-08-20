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

export const WIN32_PATHS = (): readonly string[] => [
  join(process.env[PROGRAM_FILES_86] || '', 'LIBREO~1/program/soffice.exe'),
  join(process.env[PROGRAM_FILES_86] || '', 'LibreOffice/program/soffice.exe'),
  join(process.env[PROGRAM_FILES] || '', 'LibreOffice/program/soffice.exe'),
];
