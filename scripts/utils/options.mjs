import fsp from 'fs/promises';
import path from 'path';
import { isExists } from './fs.mjs';
import { SCRIPTS_PATH } from './path.mjs';

const OPTIONS_PATH = path.resolve(SCRIPTS_PATH, 'options.json')

const getOptions = async () => {
  if( await isExists(OPTIONS_PATH) ) {
    return JSON.parse(await fsp.readFile(OPTIONS_PATH, 'utf-8'));
  }

  return {};
}

export const get = async (key) => {
  const options = await getOptions();

  return options[key];
}

export const set = async (key, value) => {
  const options = await getOptions();
  options[key] = value;

  await fsp.writeFile(OPTIONS_PATH, JSON.stringify(options, null, 2), 'utf-8');
}