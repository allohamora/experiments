const DEFAULT_OPTIONS = {
  first: 'https://images.unsplash.com/photo-1558637845-c8b7ead71a3e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8MTYlM0E5fGVufDB8fDB8fA%3D%3D&w=1000&q=80',
  second: 'https://images.unsplash.com/photo-1580757468214-c73f7062a5cb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8MTYlM0E5fGVufDB8fDB8fA%3D%3D&w=1000&q=80',
  separator: {
    bg: '#2980b9',
    circle: {
      inner: {
        bg: '#3498db'
      },
      outer: {
        bg: '#ecf0f1'
      }
    }
  }
};

const CONTAINER_CLASS = 'container';
const SEPARATOR_CLASS = 'separator';
const DND_CLASS = 'dnd';

class ImageComparison extends HTMLElement {
  styles() {
    return `
      <style>
        * {
          box-sizing: border-box;
        }

        .${CONTAINER_CLASS} {
          position: relative;

          display: flex;
        }

        .image {
          width: 100%;
          width: 100%;

          object-fit: cover;
          user-select: none;
          pointer-events: none;
        }

        .image:nth-of-type(2) {
          margin-left: -100%;
        }

        .${SEPARATOR_CLASS} {
          position: absolute;
          left: 50%;
          top: 0;

          transform: translate(-50%);

          height: 100%;

          touch-action: none;
        }

        .line {
          height: 100%;
          width: 10px;
          margin: 0 auto;
          background-color: ${this.separator.bg};
        }

        .circle {
          position: relative;
          top: -50%;
          left: -50%;
          transform: translate(50%, 50%);
          z-index: 3;

          border: 20px solid ${this.separator.circle.outer.bg};
          border-radius: 50%;
        }

        .circle::after {
          content: '';

          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);

          border: 12px solid ${this.separator.circle.inner.bg};
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
        <img class="image" src="${this.first}" alt="first image">
        <img class="image" src="${this.second}" alt="second image">
        <div class="${SEPARATOR_CLASS}">
          <div class="line ${DND_CLASS}"></div>
          <div class="circle ${DND_CLASS}"></div>
        </div>
      </div>
    `;

    this.elements.separator = this.target.querySelector(`.${SEPARATOR_CLASS}`);
    this.elements.container = this.target.querySelector(`.${CONTAINER_CLASS}`);
  }

  calculateClickedCoords(event) {
    const { x, y, currentTarget } = event;
    const { left, top } = currentTarget.getBoundingClientRect();

    return { y: Math.round(y - top), x: Math.round(x - left) };
  }

  separatorPointerDownHandler = (event) => {
    if( !event.target.classList.contains(DND_CLASS) ) return;

    this.clickedCoords = this.calculateClickedCoords(event);
    this.isDrag = true;
  }

  calculateSeparatorX(event) {
    const { x } = this.clickedCoords;
    const { container } = this.elements;
    const { left } = container.getBoundingClientRect();

    return event.x - x - left;
  }

  handleSeparatorMinAndMaxX(x) {
    const { container, separator } = this.elements;
    const min = 0;
    const max = container.clientWidth - separator.clientWidth;

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
    this.first = this.getAttribute('first') ?? DEFAULT_OPTIONS.first;
    this.second = this.getAttribute('second') ?? DEFAULT_OPTIONS.second;
    this.separator = JSON.parse(this.getAttribute('separator')) ?? DEFAULT_OPTIONS.separator;

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