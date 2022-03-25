export const initCanvas = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 300;

  document.body.append(canvas);

  const ctx = canvas.getContext('2d');

  return { canvas, ctx };
};

const startDraw = (ctx) => {
  ctx.beginPath();
  ctx.moveTo(0, 0);
};

const drawLines = (ctx, points, t = 1) => {
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : points[0];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i != points.length - 2 ? points[i + 2] : p2;

    const cp1x = p1.x + ((p2.x - p0.x) / 6) * t;
    const cp1y = p1.y + ((p2.y - p0.y) / 6) * t;

    const cp2x = p2.x - ((p3.x - p1.x) / 6) * t;
    const cp2y = p2.y - ((p3.y - p1.y) / 6) * t;

    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
  }
};

const endDraw = (ctx) => {
  ctx.stroke();
};

export const draw = (ctx, points) => {
  startDraw(ctx);
  drawLines(ctx, points, 1);
  endDraw(ctx);
};
