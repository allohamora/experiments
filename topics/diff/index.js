const isArray = (value) => Array.isArray(value);
const isObject = (value) => typeof value === 'object' && value !== null;
const isPrimitive = (value) => !isObject(value);

const deepEqual = (a, b) => {
  if (a === b) {
    return true;
  }

  if ((isPrimitive(a) || isPrimitive(b)) && a !== b) {
    return false;
  }

  const keysSet = new Set([...Object.keys(a), ...Object.keys(b)]);
  const keys = Array.from(keysSet);

  for (const key of keys) {
    const [aValue, bValue] = [a[key], b[key]];

    if ((isPrimitive(aValue) || isPrimitive(bValue)) && aValue !== bValue) {
      return false;
    }

    if (isObject(aValue) && isObject(bValue) && !deepEqual(aValue, bValue)) {
      return false;
    }
  }

  return true;
};

const objectDiff = (a, b) => {
  const keysSet = new Set([...Object.keys(a), ...Object.keys(b)]);
  const keys = Array.from(keysSet);

  return keys.reduce((result, key) => {
    const values = [a[key], b[key]];

    if (!deepEqual(...values)) {
      result.push({ key, values });
    }

    return result;
  }, []);
};

const arrayDiff = (...targets) => {
  const tableOfContent = targets.flat(1).reduce((map, key) => {
    const value = map.get(key) ?? 0;
    map.set(key, value + 1);

    return map;
  }, new Map());

  return Array.from(tableOfContent.entries())
    .filter(([, value]) => value === 1)
    .map(([key]) => key);
};
