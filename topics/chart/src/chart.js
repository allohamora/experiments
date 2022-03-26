export const initCanvas = ({ width, height } = {}) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  document.body.append(canvas);

  const ctx = canvas.getContext('2d');

  return { canvas, ctx };
};

/**
 * google it: spline interpolation canvas curve js
 * https://stackoverflow.com/questions/7054272/how-to-draw-smooth-curve-through-n-points-using-javascript-html5-canvas
 */
const drawLines = ({ ctx, points, height, padding, tension: t }) => {
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);

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

  ctx.stroke();
};

const drawPoints = ({ points, ctx, circleSize }) => {
  for (const { x, y } of points) {
    ctx.beginPath();

    ctx.arc(x, y, circleSize, 0, 2 * Math.PI);

    ctx.fill();
  }
};

const drawTooltips = ({ points, ctx, fontSize, circleSize }) => {
  for (const { x, y, value } of points) {
    ctx.beginPath();

    ctx.font = `${fontSize}px`;
    ctx.textAlign = 'center';

    ctx.strokeText(value, x, y - circleSize - fontSize / 4);

    ctx.fill();
  }
};

export const draw = (context) => {
  drawLines(context);
  drawPoints(context);
  drawTooltips(context);
};

export const computePoints = ({ data, viewWidth, viewHeight, padding }) => {
  const step = viewWidth / (data.length - 1);

  const min = Math.min(...data);
  const max = Math.max(...data);

  const ratio = (max - min) / viewHeight;

  return data.map((value, i) => ({
    x: Math.floor(i * step + padding),
    y: Math.floor(viewHeight + padding - (value - min) / ratio),
    value,
  }));
};
