import { on } from './events.js';
import { replaceHash } from './history.js';
import { calculateCoords, getPageCoords } from './coords.js';
import { now } from './performance.js';
import { ease } from './ease.js';
import { querySelector } from './dom.js';
import { EventEmitter } from './event-emiter.js';

const SCROLL_TIME = 468;
const EASE_FUNCTION = ease;

const ee = new EventEmitter();

let isSmothScrollRuning = false;

const scroll = (x, y) => {
  window.scrollTo(x, y);
};

const step = (ctx) => {
  const { startTime, startX, finishX, startY, finishY } = ctx;
  const time = now();

  const notSafet = (time - startTime) / SCROLL_TIME;
  const t = notSafet > 1 ? 1 : notSafet;

  const value = EASE_FUNCTION(t);
  const currentX = startX + (finishX - startX) * value;
  const currentY = startY + (finishY - startY) * value;

  scroll(currentX, currentY);

  if (currentX === finishX && currentY === finishY) {
    ee.emit('finish');
  }
};

const mySmoothScroll = (target) => {
  isSmothScrollRuning = true;

  const startTime = now();

  const { x: startX, y: startY } = getPageCoords();
  const { x: finishX, y: finishY } = calculateCoords(target);

  const stepInterval = setInterval(() => {
    requestAnimationFrame(() => step({ startTime, startX, startY, finishX, finishY }));
  }, 0);

  const stopInterval = () => {
    clearInterval(stepInterval);

    isSmothScrollRuning = false;

    ee.off('stop', stopInterval);
    ee.off('finish', stopInterval);
  };

  ee.on('stop', stopInterval);
  ee.on('finish', stopInterval);
};

const registerSmoothScroll = (smoothScrollFn) => {
  on(document, 'click', (e) => {
    const { target } = e;

    const { tagName } = target;
    if (tagName !== 'A') return;

    const { hash } = target;
    if (hash === '') return;

    const anchorTarget = querySelector(document, `${hash}`);
    if (!anchorTarget) {
      return;
    }

    e.preventDefault();

    function offHandlers() {
      ee.off('finish', replaceUrlHash);
      ee.off('stop', offHandlers);
    }

    function replaceUrlHash() {
      replaceHash(hash);

      offHandlers();
    }

    ee.once('finish', replaceUrlHash);
    ee.once('stop', offHandlers);

    smoothScrollFn(anchorTarget);
  });

  const stopSmoothScrollIfRunning = () => {
    if (isSmothScrollRuning) {
      ee.emit('stop');
    }
  };

  on(window, 'wheel', stopSmoothScrollIfRunning);
  on(window, 'touchstart', stopSmoothScrollIfRunning);
};

const smoothScrollPolyfill = () => {
  on(document, 'click', (e) => {
    const { target } = e;

    const { tagName } = target;
    if (tagName !== 'A') return;

    const { hash } = target;
    if (hash === '') return;

    const anchorTarget = querySelector(document, `${hash}`);
    if (!anchorTarget) {
      return;
    }

    e.preventDefault();
    anchorTarget.scrollIntoView({ behavior: 'smooth' });
  });
};

const initMy = () => registerSmoothScroll(mySmoothScroll);
const initPolyfill = () => smoothScrollPolyfill();

const init = initPolyfill;

initMy();
