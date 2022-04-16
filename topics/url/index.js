import { URL, fileURLToPath } from 'node:url';
import './test.js';

// file://:base-path/index.js (current file path)
const metaUrl = import.meta.url;

// url uses base path from metaUrl and rewrites index.js to 'package.json';
const packageJsonFileUrl = new URL('package.json', metaUrl);

// removes file://
const packageJsonUrl = fileURLToPath(packageJsonFileUrl);

console.log({ metaUrl, packageJsonFileUrl, packageJsonUrl });
