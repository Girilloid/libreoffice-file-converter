export const isObject = (item: unknown): item is Record<string, unknown> => {
  return Boolean(item && typeof item === 'object' && !Array.isArray(item));
};

export const deepMerge = <T extends Record<string, unknown>>(...objects: readonly T[]): T => {
  return objects.reduce<T>((target, source) => {
    Object.keys(source).forEach((key: keyof T) => {
      const targetValue = target[key];
      const sourceValue = source[key];

      if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
        target[key] = [...targetValue, ...sourceValue] as T[keyof T];

        return;
      }

      if (isObject(targetValue) && isObject(sourceValue)) {
        target[key] = deepMerge(targetValue, sourceValue);

        return;
      }

      target[key] = sourceValue;
    });

    return target;
  }, {} as T);
};
