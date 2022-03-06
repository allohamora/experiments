import { TokenType, Type } from "./token-type.js";

export const tokenTypes = [
  new TokenType(Type.ObjectOpen, '{'),
  new TokenType(Type.ObjectClose, '}'),
  new TokenType(Type.ArrayClose, '\\['),
  new TokenType(Type.ArrayClose, '\\]'),
  new TokenType(Type.Comma, ','),
  new TokenType(Type.Colon, ':'),
  new TokenType(Type.String, '".+?"'),
  new TokenType(Type.Raw, 'true|false|null|\\d+')
];