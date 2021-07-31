const FPS = 60;
const SPEED = 1000; // px/s

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
  const pathControllers = { 
    x: path(from.x, to.x), 
    y: path(from.y, to.y) 
  };

  const seconds = (pathControllers.y.fullPath + pathControllers.x.fullPath) / SPEED;
  const frames = seconds * FPS;
  const timeStep = seconds * 1000 / frames;

  const getStep = (fullPath) => fullPath / frames;

  const step = { 
    x: getStep(pathControllers.x.fullPath),
    y: getStep(pathControllers.y.fullPath)
  };

  const scrollEvents = ['touchstart', 'wheel'];

  let current = {...from};

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

  const createOneStep = (direction = 'x') => () => {
    if( from[direction] > to[direction] ) {
      current[direction] -= step[direction];
    } else {
      current[direction] += step[direction];
    }
  }

  const oneStep = { 
    x: createOneStep('x'), 
    y: createOneStep('y') 
  };

  const createIsFinish = (direction = 'x') => () => {
    if( from[direction] > to[direction] ) {
      return current[direction] <= to[direction];
    } 

    return current[direction] >= to[direction];
  }

  const finish = { 
    x: createIsFinish('x'), 
    y: createIsFinish('y') 
  };

  const isFinish = () => finish.x() && finish.y();

  const get = (direction = 'x') => () => {
    if( finish[direction]() ) return to[direction];

    oneStep[direction]();

    const easing = EASE_METHOD(pathControllers[direction].toEasing(current[direction]));
    const point = pathControllers[direction].fromEasing(easing);

    return point;
  }

  const getX = get('x');
  const getY = get('y');

  const animationStep = () => requestAnimationFrame(() => {
    const x = getX();
    const y = getY();

    console.log(x, y);

    window.scrollTo(x, y);

    if( isFinish() ) {
      onFinish();
    } else {
      timeout = setTimeout(animationStep, timeStep);
    }
  })

  subscribe();
  animationStep();
});

/**
 * 
 * @param {HTMLAnchorElement} a,
 * @param {string} hash 
 */
const smoothScroll = (a, hash) => {
  const elementId = hash.slice(1);
  const element = document.getElementById(elementId);
  
  if( element === null ) return replaceHash(hash);

  const { offsetTop, offsetLeft } = element;

  const from = { x: window.pageXOffset, y: window.pageYOffset };
  const to = { x: offsetLeft, y: offsetTop };

  animate(from, to)
    .then(() => replaceHash(hash), noop); // noop need for remove promise reject error on cancel animation 
}

/**
 * 
 * @param {HTMLAnchorElement} a 
 * @param {string} hash
 */
const smoothScrollPolyfill = (a, hash) => {
  const id = hash.slice(1);

  let scrollTimeout;

  const onScroll = () => {
    clearTimeout(scrollTimeout);
    
    scrollTimeout = setTimeout(() => {
      location.replace(hash);
      off(document, 'scroll', onScroll);
    }, 100);
  }

  on(document, 'scroll', onScroll);

  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

const createInit = (smoothScrollFn) => () => document.addEventListener('click', e => {
  const { target } = e;

  const { tagName } = target;
  if( tagName !== 'A' ) return;

  const { hash } = target;
  if( hash === '' ) return;

  e.preventDefault();
  smoothScrollFn(target, hash);
});

const mySmoothScrollInit = createInit(smoothScroll);
const smoothScrollPolyfillInit = createInit(smoothScrollPolyfill);

smoothScrollPolyfillInit();