export const debounce = <Args extends unknown[]>(fn: (...args: Args) => unknown, delay: number) => {
  let timeout: NodeJS.Timeout;

  return (...args: Args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};
