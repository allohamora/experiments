import fsp from 'node:fs/promises';

export const isExists = async (path) => {
  return await fsp
    .access(path)
    .then(() => true)
    .catch(() => false);
};
