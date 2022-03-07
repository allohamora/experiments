export class SyntaxError extends Error {
  // # private fields because _ private fields are displayed in console
  #range;
  #source;

  constructor(range, source) {
    super('');

    this.#range = range;
    this.#source = source;

    this.message = this.createMessage();
  }

  createMessage() {
    const rangeDiff = this.#range[1] - this.#range[0];

    if (rangeDiff < 2) {
      return this.createTokenMessage();
    } else {
      return this.createRangeMessage();
    }
  }

  createTokenMessage() {
    const index = this.#range[0];

    return `unexpected token on position: ${index}
'${this.#source}'
 ${' '.repeat(index)}^
`;
  }

  createRangeMessage() {
    const range = this.#range.join('-');
    const slice = this.#source.slice(this.#range[0], this.#range[1]);

    return `unexpected input on range: ${range}
'${slice}'
 ${'-'.repeat(slice.length)}
`;
  }
}
