const getEnumValues = <V>(enumTarget: Record<string, V>) => {
  const keys = Object.keys(enumTarget);
  const filtered = keys.filter((key) => isNaN(Number(key)));

  return filtered.map((key) => enumTarget[key]);
};

export const oneOfEnum = <V extends unknown>(
  name: string,
  enumTarget: Record<string, V>,
  set: (value: V) => unknown,
  current: V,
) => {
  const values = getEnumValues(enumTarget);
  const promptResult = prompt(`Change ${name}. Current: ${current}. Supported: [${values.join(', ')}]`);

  if (!promptResult || !values.some((value) => value === promptResult || value === Number(promptResult))) {
    return;
  }

  const isNumberEnum = values.some((value) => typeof value === 'number');
  const value = isNumberEnum ? Number(promptResult) : promptResult;

  set(value as V);
};
