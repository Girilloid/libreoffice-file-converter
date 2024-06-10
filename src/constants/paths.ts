import { join } from 'node:path';
import process from 'node:process';

import { PROGRAMFILES, PROGRAMFILES86 } from './env-vars';

export const DARWIN_PATHS = () => ['/Applications/LibreOffice.app/Contents/MacOS/soffice'];

export const LINUX_PATHS = () => [
  '/usr/bin/libreoffice',
  '/usr/bin/soffice',
  '/snap/bin/libreoffice',
  '/opt/libreoffice/program/soffice',
  '/opt/libreoffice7.6/program/soffice',
];

export const WIN32_PATHS = () => [
  join(process.env[PROGRAMFILES86], 'LIBREO~1/program/soffice.exe'),
  join(process.env[PROGRAMFILES86], 'LibreOffice/program/soffice.exe'),
  join(process.env[PROGRAMFILES], 'LibreOffice/program/soffice.exe'),
];
