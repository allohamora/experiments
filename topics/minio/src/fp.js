export const chain = (...funcs) => {
  return (...args) => {
    for (const func of funcs) {
      func(...args);
    }
  };
};
