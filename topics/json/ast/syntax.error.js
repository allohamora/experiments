export class SyntaxError extends Error {
  constructor(range, source) {
    super(`invalid token on position: ${range.join('-')}. raw: =>'${source.slice(range[0])}'`);
  }
}