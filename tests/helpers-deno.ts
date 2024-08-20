import { join } from 'node:path';

export const getInputPath = (fileName: string): string => {
  return join(import.meta.dirname || '', 'resources', fileName);
};

export const getOutputPathFactory = (outputDir: string) => {
  return (fileName: string): string => {
    return join(import.meta.dirname || '', `resources/${outputDir}`, fileName);
  };
};
