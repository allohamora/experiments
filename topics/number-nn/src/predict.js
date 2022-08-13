import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getSavedModel } from './model.js';
import * as tf from '@tensorflow/tfjs-node-gpu';
import jimp from 'jimp';

const __dirname = dirname(fileURLToPath(import.meta.url));

const IMAGE_HEIGHT = 28;
const IMAGE_WIDTH = 28;

const IMAGE_TARGET = '0.png';
const TARGET_PATH = join(__dirname, '..', 'image', IMAGE_TARGET);

const getTensor = async () => {
  const file = await readFile(TARGET_PATH);
  const jimpImage = await jimp.read(file);
  const image = new Float32Array(IMAGE_HEIGHT * IMAGE_WIDTH);

  let i = 0;

  for (let h = 0; h < IMAGE_HEIGHT; h++) {
    for (let w = 0; w < IMAGE_HEIGHT; w++) {
      image[i++] = jimpImage.getPixelColor(w, h);
    }
  }

  const imagesShape = [1, IMAGE_HEIGHT, IMAGE_WIDTH, 1];

  return tf.tensor4d(image, imagesShape);
};

const ZERO = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const ONE = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
const TWO = [0, 0, 1, 0, 0, 0, 0, 0, 0, 0];
const THREE = [0, 0, 0, 1, 0, 0, 0, 0, 0, 0];
const FOUR = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0];
const FIVE = [0, 0, 0, 0, 0, 1, 0, 0, 0, 0];
const SIX = [0, 0, 0, 0, 0, 0, 1, 0, 0, 0];
const SEVEN = [0, 0, 0, 0, 0, 0, 0, 1, 0, 0];
const EIGHT = [0, 0, 0, 0, 0, 0, 0, 0, 1, 0];
const NINE = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1];

const Result = {
  [JSON.stringify(ZERO)]: 'zero',
  [JSON.stringify(ONE)]: 'one',
  [JSON.stringify(TWO)]: 'two',
  [JSON.stringify(THREE)]: 'three',
  [JSON.stringify(FOUR)]: 'four',
  [JSON.stringify(FIVE)]: 'five',
  [JSON.stringify(SIX)]: 'six',
  [JSON.stringify(SEVEN)]: 'seven',
  [JSON.stringify(EIGHT)]: 'eight',
  [JSON.stringify(NINE)]: 'nine',
};

const predict = async () => {
  const tensor = await getTensor();
  const model = await getSavedModel();

  const result = model.predict(tensor);
  const data = await result.data();
  const answer = Result[JSON.stringify([...data])];

  console.log(`I think "${IMAGE_TARGET}" is a ${answer}`);
};

predict();
