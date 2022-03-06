import { TokenFinder } from "../token-finder.js";
import { StringToken } from "./string.token.js";
import { Token } from "./token.js";

export class ColonToken extends Token {
  static finder = new TokenFinder(':');

  astBuildHandler({ prev, invalidTokenError }) {
    if( prev instanceof StringToken ) {
      return;
    }

    throw invalidTokenError();
  }
}