export const calculateX = (element) => {
  return element.offsetLeft;
};

export const calculateY = (element) => {
  return element.offsetTop;
};

export const calculateCoords = (element) => ({
  x: calculateX(element),
  y: calculateY(element),
});

export const getPageCoords = () => ({
  x: scrollX,
  y: scrollY,
});
