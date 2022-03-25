import { initCanvas, draw, computePoints } from './chart.js';

const data = [-10, 0, 10, 0, -10];

const HEIGHT = 300;
const WIDTH = 300;
const PADDING = 20;
const VIEW_HEIGHT = HEIGHT - PADDING * 2;
const VIEW_WIDTH = WIDTH - PADDING * 2;

const main = () => {
  const { ctx } = initCanvas({ height: HEIGHT, width: WIDTH });
  const points = computePoints({ data, height: VIEW_HEIGHT, width: VIEW_WIDTH, padding: PADDING });

  draw({ ctx, points, height: HEIGHT, padding: PADDING, circleSize: 5, fontSize: 14 });
};

main();
