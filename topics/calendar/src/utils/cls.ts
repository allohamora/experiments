export const cls = (...classes: unknown[]) => {
  return classes.filter((value) => typeof value === 'string').join(' ');
};
