export class TokenFinder {
  constructor(strRegexp) {
    this._regexp = this.compileRegexp(strRegexp);
  }

  compileRegexp(strRegexp) {
    return new RegExp(strRegexp, 'dy');
  }

  match(body) {
    const match = this._regexp.exec(body);

    if( match === null ) {
      return match;
    }

    const [value] = match;
    const [range] = match.indices;

    return { value, range };
  }

  matchByPos(body, pos) {
    this._regexp.lastIndex = pos;
    const match = this.match(body);
    this._regexp.lastIndex = 0;

    return match;
  }
}