import { access as fsAccess, readdir, unlink } from 'node:fs/promises';
import { resolve } from 'node:path';

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
      return unlink(resolve(path, file));
    }),
  );
};

export const getInputPath = (fileName: string): string => {
  return resolve('./tests/resources', fileName);
};

export const getOutputPathFactory = (outputDir: string) => {
  return (fileName: string): string => {
    return resolve(`./tests/resources/${outputDir}`, fileName);
  };
};

export const outputFormat = 'pdf';
export const timeout = 10 * 1000;

export const formats = ['doc', 'docx', 'gif', 'jpg', 'odp', 'ods', 'odt', 'png', 'ppt', 'rtf', 'xls', 'xlsx'];
