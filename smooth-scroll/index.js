const FPS = 60;
const SPEED = 700; // px/s

const arrayOrValueInArray = (value) => value instanceof Array ? value : [value];

const subscribeFactory = (method) => (target, eventOrEvents, handlerOrHandlers) => {
  const events = arrayOrValueInArray(eventOrEvents);
  const handlers = arrayOrValueInArray(handlerOrHandlers);

  handlers.forEach(handler => {
    events.forEach(event => {
      target[method](event, handler);
    })
  })
}

const on = subscribeFactory('addEventListener');
const off = subscribeFactory('removeEventListener');

const noop = () => {};

/**
 * 
 * @param {string} hash 
 * @returns {void}
 */
const replaceHash = (hash) => location.replace(hash);

/**
 * 
 * @param {number} easing 
 * @returns {number} easing
 */
const ease = (easing) => 0.5 * (1 - Math.cos(Math.PI * easing));

const EASE_METHOD = easing => easing;

/**
 * 
 * @param {number} from 
 * @param {number} to 
 */
const path = (from, to) => {
  const fullPath = Math.abs(to - from);
  const fullPathPercent = fullPath / 100;

  /**
   * 
   * @param {number} point 
   * @returns {number} percent
   */
  const toPercent = (point) => {
    const path = Math.abs(point - from);
    const pointPercent = path * 100 / fullPath;

    return pointPercent;
  }

  /**
   * 
   * @param {number} point 
   * @returns {number} easing
   */
  const toEasing = (point) => {
    const percent = toPercent(point);
    if( percent >= 100 ) return 1;

    return percent / 100;
  }

  /**
   * 
   * @param {number} percent 
   * @returns {number} point
   */
  const fromPercent = (percent) => {
    if( from > to ) {
      return from - fullPathPercent * percent;
    }

    return fullPathPercent * percent + from;
  }

  /**
   * 
   * @param {number} easing 
   * @returns {number} point
   */
  const fromEasing = (easing) => {
    return fromPercent(easing * 100);
  }

  return {
    fullPath,
    toPercent,
    toEasing,
    fromPercent,
    fromEasing,
  }
}

/**
 * 
 * @param {{ x: number, y: number }} from 
 * @param {{ x: number, y: number }} to 
 */
const animate = (from, to) => new Promise((res, rej) => {
  const yPath = path(from.y, to.y);
  const seconds = yPath.fullPath / SPEED;
  const frames = seconds * FPS;
  const timeStep = seconds * 1000 / frames;
  const yStep = yPath.fullPath / frames;

  const scrollEvents = ['touchstart', 'wheel'];

  let y = from.y;
  let timeout;
  let onCancel;

  const subscribe = () => {
    on(document, scrollEvents, onCancel);
  }

  const unSubscribe = () => {
    off(document, scrollEvents, onCancel);
  }

  onCancel = () => {
    clearTimeout(timeout);
    unSubscribe();
    rej();
  }

  const onFinish = () => {
    unSubscribe();
    res();
  }

  const oneStep = () => {
    if( from.y > to.y ) {
      y -= yStep
    } else {
      y += yStep
    };
  }

  const isFinish = () => {
    if( from.y > to.y ) {
      return y <= to.y;
    } 

    return y >= to.y;
  };

  const step = () => {
    oneStep();

    const easing = EASE_METHOD(yPath.toEasing(y));
    const point = yPath.fromEasing(easing);

    window.scrollTo(to.x, point);

    if( isFinish() ) {
      onFinish();
    } else {
      timeout = setTimeout(step, timeStep);
    }
  }

  subscribe();
  step();
});

/**
 * 
 * @param {HTMLAnchorElement} a 
 */
const smoothScroll = (a) => {
  const { hash, offsetTop: aOffsetTop } = a;
  const elementId = hash.slice(1);
  const element = document.getElementById(elementId);
  
  if( element === null ) return replaceHash(hash);

  const { offsetTop: elementOffsetTop } = element;

  const from = { x: 0, y: aOffsetTop };
  const to = { x: 0, y: elementOffsetTop };

  animate(from, to)
    .then(() => replaceHash(hash), noop);
}

document.addEventListener('click', e => {
  const { target } = e;

  const { tagName } = target;
  if( tagName !== 'A' ) return;

  const { hash } = target;
  if( hash === '' ) return;

  e.preventDefault();
  smoothScroll(target);
});