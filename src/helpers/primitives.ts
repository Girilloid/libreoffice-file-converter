export const isObject = (item: unknown): boolean => {
  return Boolean(item && typeof item === 'object' && !Array.isArray(item));
};

export const deepMerge = <T extends object>(target: T, ...sources: readonly T[]): T => {
  if (!sources.length) {
    return target;
  }

  const [source, ...restSources] = sources;

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }

        deepMerge(target[key] as object, source[key] as object);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...restSources);
};
