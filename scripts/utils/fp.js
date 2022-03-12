export const compose =
  (...fns) =>
  (arg) => {
    return fns.reduce((value, fn) => fn(value), arg);
  };
