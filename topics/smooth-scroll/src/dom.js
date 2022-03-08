export const querySelector = (target, selector) => {
  try {
    return target.querySelector(selector);
  } catch (error) {
    return null;
  }
};
