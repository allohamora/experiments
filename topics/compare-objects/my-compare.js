const checkValues = (a, b) => {
  const keys = Object.keys(a);

  for (const key of keys) {
    const aValue = a[key];
    const bValue = b[key];

    if (aValue === bValue) {
      continue;
    }

    if (typeof aValue === 'object' && typeof bValue === 'object' && checkValues(aValue, bValue)) {
      continue;
    }

    if (aValue !== bValue) {
      return false;
    }
  }

  return true;
};

export const compare = (a, b) => {
  return checkValues(a, b) && checkValues(b, a);
};
