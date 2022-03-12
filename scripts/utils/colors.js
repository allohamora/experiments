import { compose } from './fp.js';

export const CLEAN_CODE = '\x1b[0m';

export const CYAN = '\x1b[36m';
export const RED = '\x1b[31m';
export const YELLOW = '\x1b[33m';

export const withCleanCode = (string) => `${string}${CLEAN_CODE}`;
export const withCyan = (string) => `${CYAN}${string}`;
export const withRed = (string) => `${RED}${string}`;
export const withYellow = (string) => `${YELLOW}${string}`;

export const cyan = compose(withCyan, withCleanCode);
export const red = compose(withRed, withCleanCode);
export const yellow = compose(withYellow, withCleanCode);
