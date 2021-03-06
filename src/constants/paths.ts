import { join } from 'path';

import { PROGRAMFILES, PROGRAMFILES86 } from './env-vars';

export const DARWIN_PATHS = () => ['/Applications/LibreOffice.app/Contents/MacOS/soffice'];

export const LINUX_PATHS = () => ['/usr/bin/libreoffice', '/usr/bin/soffice'];

export const WIN32_PATHS = () => [
  join(process.env[PROGRAMFILES86], 'LIBREO~1/program/soffice.exe'),
  join(process.env[PROGRAMFILES86], 'LibreOffice/program/soffice.exe'),
  join(process.env[PROGRAMFILES], 'LibreOffice/program/soffice.exe'),
];
