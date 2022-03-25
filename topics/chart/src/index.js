import { initCanvas, draw } from './chart.js';

const points = [
  { x: 50, y: 50 },
  { x: 150, y: 100 },
  { x: 150, y: 150 },
  { x: 200, y: 200 },
];

const main = () => {
  const { ctx } = initCanvas();

  draw(ctx, points);
};

main();
