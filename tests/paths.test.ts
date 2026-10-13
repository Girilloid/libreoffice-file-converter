import assert from 'node:assert/strict';
import { join } from 'node:path';
import process from 'node:process';
import { after, describe, it } from 'node:test';

import { PROGRAM_FILES, PROGRAM_FILES_86, WIN32_PATHS } from '../src/constants';

describe('constants/paths', () => {
  describe('WIN32_PATHS', () => {
    const originalProgramFiles = process.env[PROGRAM_FILES];
    const originalProgramFiles86 = process.env[PROGRAM_FILES_86];

    after(() => {
      if (originalProgramFiles === undefined) {
        delete process.env[PROGRAM_FILES];
      } else {
        process.env[PROGRAM_FILES] = originalProgramFiles;
      }

      if (originalProgramFiles86 === undefined) {
        delete process.env[PROGRAM_FILES_86];
      } else {
        process.env[PROGRAM_FILES_86] = originalProgramFiles86;
      }
    });

    it('returns no paths when env vars are unset', () => {
      delete process.env[PROGRAM_FILES];
      delete process.env[PROGRAM_FILES_86];

      const result = WIN32_PATHS();

      assert.deepEqual(result, []);
    });

    it('builds absolute paths from set env vars', () => {
      process.env[PROGRAM_FILES_86] = '/x86';
      process.env[PROGRAM_FILES] = '/pf';

      const result = WIN32_PATHS();

      assert.deepEqual(result, [
        join('/x86', 'LIBREO~1/program/soffice.exe'),
        join('/x86', 'LibreOffice/program/soffice.exe'),
        join('/pf', 'LibreOffice/program/soffice.exe'),
      ]);
    });

    it('skips entries for unset env vars', () => {
      delete process.env[PROGRAM_FILES_86];
      process.env[PROGRAM_FILES] = '/pf';

      const result = WIN32_PATHS();

      assert.deepEqual(result, [join('/pf', 'LibreOffice/program/soffice.exe')]);
    });

    it('returns no paths when env vars are empty strings', () => {
      process.env[PROGRAM_FILES] = '';
      process.env[PROGRAM_FILES_86] = '';

      const result = WIN32_PATHS();

      assert.deepEqual(result, []);
    });
  });
});
