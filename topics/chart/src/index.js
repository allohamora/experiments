import { initCanvas, draw, computePoints } from './chart.js';

const data = [-10, 0, 10, 0, -10];

const main = () => {
  const height = 300;
  const width = 300;
  const padding = 20;
  const viewHeight = height - padding * 2;
  const viewWidth = width - padding * 2;

  const circleSize = 5;
  const fontSize = 14;

  // 0 = straight lines, 1 = smooth lines
  const tension = 1;

  const { ctx } = initCanvas({ height, width });
  const points = computePoints({ data, viewHeight, viewWidth, padding });

  draw({ ctx, points, height, padding, circleSize, fontSize, tension });
};

main();
