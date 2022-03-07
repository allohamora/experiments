import { TokenFinder } from "../token-finder.js";
import { Token } from "./base/token.js";
import { ColonToken } from './colon.token.js';
import { ObjectLeaf } from '../leafs/object.leaf.js';
import { KeyLeaf } from '../leafs/key.leaf.js';
import { ValueLeaf } from '../leafs/value.leaf.js';

export class StringToken extends Token {
  static finder = new TokenFinder('".+?"');

  astBuildHandler({ parent, next }) {
    let leaf;

    if(parent instanceof ObjectLeaf && next instanceof ColonToken) {
      leaf = new KeyLeaf(this);
    } else {
      leaf = new ValueLeaf(this);
    }

    parent.appendToBody(leaf);
  }
}