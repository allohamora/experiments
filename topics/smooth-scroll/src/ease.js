// https://gist.github.com/gre/1650294

export const easeInQuad = (t) => {
  return t * (2 - t);
};

export const easeOutQuad = (t) => {
  return t * (2 - t);
};

export const ease = (t) => {
  return 0.5 * (1 - Math.cos(Math.PI * t));
};
