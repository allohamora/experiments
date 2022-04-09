import fsp from 'node:fs/promises';

export const isExists = (path) =>
  fsp
    .access(path)
    .then(() => true)
    .catch(() => false);
export const isNotExists = async (path) => !(await isExists(path));
