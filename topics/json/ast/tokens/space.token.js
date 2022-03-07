import { TokenFinder } from '../token-finder.js';
import { Token } from './base/token.js';

export class SpaceToken extends Token {
  static finder = new TokenFinder('\\s+');

  astBuildHandler() {
    throw new Error(`${this.type} is blacklisted`);
  }
}
