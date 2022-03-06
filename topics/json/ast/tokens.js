import { ArrayCloseToken } from './tokens/array-close.token.js';
import { ArrayOpenToken } from './tokens/array-open.token.js';
import { ColonToken } from './tokens/colon.token.js';
import { CommaToken } from './tokens/comma.token.js';
import { ObjectCloseToken } from './tokens/object-close.token.js';
import { ObjectOpenToken } from './tokens/object-open.token.js'
import { RawToken } from './tokens/raw.token.js';
import { SpaceToken } from './tokens/space.token.js';
import { StringToken } from './tokens/string.token.js';

export const tokens = [
  ArrayCloseToken,
  ArrayOpenToken,
  ColonToken,
  CommaToken,
  ObjectCloseToken,
  ObjectOpenToken,
  RawToken,
  StringToken,
  SpaceToken
];