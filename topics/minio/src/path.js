import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const __dirname = dirname(fileURLToPath(import.meta.url));

export const PUBLIC_PATH = join(__dirname, 'public');
export const UPLOAD_PATH = join(__dirname, 'upload');

export const publicFilePath = (fileName) => join(PUBLIC_PATH, fileName);
export const uploadFilePath = (fileName) => join(UPLOAD_PATH, fileName);
