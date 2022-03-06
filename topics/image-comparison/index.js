const DEFAULT_BEFORE = 'https://i.imgur.com/d7FBNqi.jpg';
const DEFAULT_AFTER = 'https://i.imgur.com/znzRHFd.jpg';

const CONTAINER_CLASS = 'container';

const BEFORE_CLASS = 'before';
const AFTER_CLASS = 'after';

const SEPARATOR_CLASS = 'separator';
const DND_CLASS = 'dnd';
const CIRCLE_CLASS = 'circe';
const LINE_CLASS = 'line';

class ImageComparison extends HTMLElement {
  styles() {
    return `
      <style>
        * {
          box-sizing: border-box;
        }

        :host {
          --width: 1000px;
          --height: 750px;

          --separator-bg: #2980b9;
          --separator-circle-inner-bg: #3498db;
          --separator-circle-outer-bg: #ecf0f1;
        }

        .${CONTAINER_CLASS} {
          position: relative;

          display: flex;

          height: var(--height);
          width: var(--width);
        }

        .${AFTER_CLASS}, .${BEFORE_CLASS} {
          position: absolute;
          left: 0;
          top: 0;

          height: 100%;
          width: 100%;

          overflow: hidden;
        }

        .${AFTER_CLASS} {
          z-index: 1;

          width: 50%;
        }

        .${AFTER_CLASS} > img, .${BEFORE_CLASS} > img {
          display: block;
          
          width: var(--width);
          height: var(--height);

          object-fit: fill;
        }

        .${SEPARATOR_CLASS} {
          position: absolute;
          left: 50%;
          top: 0;
          
          z-index: 2;

          transform: translate(-50%);

          display: flex;
          justify-content: center;
          align-items: center;

          height: 100%;

          touch-action: none;
        }

        .${LINE_CLASS} {
          position: absolute;

          height: 100%;
          width: 10px;

          background-color: var(--separator-bg);
        }

        .${CIRCLE_CLASS} {
          position: relative;
          z-index: 3;

          border: 20px solid var(--separator-circle-outer-bg);
          border-radius: 50%;
        }

        .${CIRCLE_CLASS}::after {
          content: '';

          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);

          border: 12px solid var(--separator-circle-inner-bg);
          border-radius: 50%;
        }

        .${DND_CLASS} {
          cursor: pointer;
          touch-action: none;
        }
      </style>
    `;
  }

  render() {
    this.target.innerHTML = `
      ${this.styles()}

      <div class="${CONTAINER_CLASS}">
        <div class="${BEFORE_CLASS}">
          <img alt="after image" src="${this.before}">
        </div>

        <div class="${AFTER_CLASS}">
          <img alt="after image" src="${this.after}">
        </div>

        <div class="${SEPARATOR_CLASS}">
          <div class="${LINE_CLASS} ${DND_CLASS}"></div>
          <div class="${CIRCLE_CLASS} ${DND_CLASS}"></div>
        </div>
      </div>
    `;

    this.elements.separator = this.target.querySelector(`.${SEPARATOR_CLASS}`);
    this.elements.container = this.target.querySelector(`.${CONTAINER_CLASS}`);
    this.elements.after = this.target.querySelector(`.${AFTER_CLASS}`);
    this.elements.circle = this.target.querySelector(`.${CIRCLE_CLASS}`);
    this.elements.line = this.target.querySelector(`.${LINE_CLASS}`);
  }

  handleImages(x) {
    const { after, separator } = this.elements;
    const separatorHalfWidth = Math.round(separator.offsetWidth / 2);
    const width = x + separatorHalfWidth;

    after.style.width = `${width}px`;
  }

  calculateClickedCoords(event) {
    const { x, y, currentTarget } = event;
    const { left, top } = currentTarget.getBoundingClientRect();

    return { y: Math.round(y - top), x: Math.round(x - left) };
  }

  separatorPointerDownHandler = (event) => {
    if( !event.target.classList.contains(DND_CLASS) ) return;
    
    const { separator } = this.elements;

    // bind all events with pointerId to separator
    separator.setPointerCapture(event.pointerId);
    this.clickedCoords = this.calculateClickedCoords(event);
    this.isDrag = true;
  }

  calculateLineOffset() {
    const { line, separator } = this.elements;

    const full = separator.offsetWidth - line.offsetWidth;
    const half = Math.round(full / 2);

    return { full, half };
  }

  calculateSeparatorX(event) {
    const { x } = this.clickedCoords;
    const { container } = this.elements;
    const { left } = container.getBoundingClientRect();

    return event.x - x - left;
  }

  handleSeparatorMinAndMaxX(x) {
    const { container, separator } = this.elements;
    const { half } = this.calculateLineOffset();
    const min = -half;
    const max = container.clientWidth - separator.clientWidth + half;

    if( x <= min ) {
      return min;
    }

    if( x >= max ) {
      return max;
    }

    return x;
  }

  separatorPointerMoveHandler = (event) => {
    if( !this.isDrag ) return;
    const { separator } = this.elements;

    const x = this.handleSeparatorMinAndMaxX(this.calculateSeparatorX(event));

    separator.style.left = `${x}px`;
    separator.style.transform = 'translate(0, 0)';
    this.handleImages(x);
  }

  separatorPointerUpHandler = () => {
    this.isDrag = false;
    this.clickedCoords = null;
  }

  initSeparatorHandlers() {
    const { separator } = this.elements;

    separator.ondragstart = () => false;

    separator.addEventListener('pointerdown', this.separatorPointerDownHandler);
    separator.addEventListener('pointermove', this.separatorPointerMoveHandler);
    separator.addEventListener('pointerup', this.separatorPointerUpHandler);
    separator.addEventListener('pointerleave', this.separatorPointerUpHandler)
  }

  init() {
    this.before = this.getAttribute('before') ?? DEFAULT_BEFORE;
    this.after = this.getAttribute('after') ?? DEFAULT_AFTER;

    this.elements = {};
    this.target = this.attachShadow({ mode: 'open' });
  }

  // entrypoint
  connectedCallback() {
    this.init();
    this.render();
    this.initSeparatorHandlers();
  }
};

customElements.define('image-comparison', ImageComparison)