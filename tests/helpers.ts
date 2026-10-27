import { access as fsAccess, readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';

export const access = async (path: string): Promise<boolean> => {
  try {
    await fsAccess(path);

    return true;
  } catch {
    return false;
  }
};

export const clearDir = async (path: string): Promise<void> => {
  const files = await readdir(path);

  await Promise.all(
    files.map((file) => {
      return rm(join(path, file), { recursive: true });
    }),
  );
};

export const getFilesCount = async (path: string): Promise<number> => {
  const files = await readdir(path);

  return files.length;
};

const testsResourcesDir = join(process.cwd(), 'tests', 'resources');

export const getInputPath = (fileName: string): string => {
  return join(testsResourcesDir, fileName);
};

export const getOutputPathFactory = (outputDir: string) => {
  return (fileName: string): string => {
    return join(testsResourcesDir, outputDir, fileName);
  };
};

export const outputFormat = 'pdf';
export const timeout = 60 * 1000;

export const formats = ['doc', 'docx', 'gif', 'jpg', 'odp', 'ods', 'odt', 'png', 'ppt', 'rtf', 'xls', 'xlsx'];
