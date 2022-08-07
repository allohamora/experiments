import * as tf from '@tensorflow/tfjs-node-gpu';
import assert from 'node:assert';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import https from 'node:https';
import zlib from 'node:zlib';
import path from 'node:path';

// MNIST data constants:
const BASE_URL = 'https://storage.googleapis.com/cvdf-datasets/mnist/';
const BASE_PATH = 'dataset';
const TRAIN_IMAGES_FILE = 'train-images-idx3-ubyte';
const TRAIN_LABELS_FILE = 'train-labels-idx1-ubyte';
const TEST_IMAGES_FILE = 't10k-images-idx3-ubyte';
const TEST_LABELS_FILE = 't10k-labels-idx1-ubyte';
const IMAGE_HEADER_MAGIC_NUM = 2051;
const IMAGE_HEADER_BYTES = 16;
const IMAGE_HEIGHT = 28;
const IMAGE_WIDTH = 28;
const IMAGE_FLAT_SIZE = IMAGE_HEIGHT * IMAGE_WIDTH;
const LABEL_HEADER_MAGIC_NUM = 2049;
const LABEL_HEADER_BYTES = 8;
const LABEL_RECORD_BYTE = 1;
const LABEL_FLAT_SIZE = 10;

const isExists = (path) => {
  return fsp
    .access(path)
    .then(() => true)
    .catch(() => false);
};

const fetchOnceAndSaveToDiskWithBuffer = async (filename) => {
  const url = `${BASE_URL}${filename}.gz`;
  const filePath = path.join(BASE_PATH, filename);

  if (await isExists(filePath)) {
    return fsp.readFile(filePath);
  }

  return new Promise((res, rej) => {
    const file = fs.createWriteStream(filePath);
    console.log(`  * Downloading from: ${url}`);

    https
      .get(url, (response) => {
        const unzip = zlib.createGunzip();
        response.pipe(unzip).pipe(file);

        unzip.on('end', async () => {
          res(await fsp.readFile(filePath));
        });

        unzip.on('error', rej);
      })
      .on('error', rej);
  });
};

const loadHeaderValues = (buffer, headerLength) => {
  const headerValues = [];

  for (let i = 0; i < headerLength / 4; i++) {
    headerValues[i] = buffer.readUInt32BE(i * 4);
  }

  return headerValues;
};

const loadImages = async (filename) => {
  const buffer = await fetchOnceAndSaveToDiskWithBuffer(filename);

  const headerBytes = IMAGE_HEADER_BYTES;
  const recordBytes = IMAGE_HEIGHT * IMAGE_WIDTH;

  const headerValues = loadHeaderValues(buffer, headerBytes);
  assert.equal(headerValues[0], IMAGE_HEADER_MAGIC_NUM);
  assert.equal(headerValues[2], IMAGE_HEIGHT);
  assert.equal(headerValues[3], IMAGE_WIDTH);

  const images = [];

  let index = headerBytes;

  while (index < buffer.byteLength) {
    const array = new Float32Array(recordBytes);

    for (let i = 0; i < recordBytes; i++) {
      array[i] = buffer.readUInt8(index++) / 255;
    }

    images.push(array);
  }

  assert.equal(images.length, headerValues[1]);

  return images;
};

const loadLabels = async (filename) => {
  const buffer = await fetchOnceAndSaveToDiskWithBuffer(filename);

  const headerBytes = LABEL_HEADER_BYTES;
  const recordBytes = LABEL_RECORD_BYTE;

  const headerValues = loadHeaderValues(buffer, headerBytes);
  assert.equal(headerValues[0], LABEL_HEADER_MAGIC_NUM);

  const labels = [];

  let index = headerBytes;

  while (index < buffer.byteLength) {
    const array = new Int32Array(recordBytes);

    for (let i = 0; i < recordBytes; i++) {
      array[i] = buffer.readUInt8(index++);
    }

    labels.push(array);
  }

  assert.equal(labels.length, headerValues[1]);
  return labels;
};

class NumberDataset {
  constructor() {
    this.dataset = null;
    this.trainSize = 0;
    this.testSize = 0;
    this.trainBatchIndex = 0;
    this.testBatchIndex = 0;
  }

  async loadData() {
    this.dataset = await Promise.all([
      loadImages(TRAIN_IMAGES_FILE),
      loadLabels(TRAIN_LABELS_FILE),
      loadImages(TEST_IMAGES_FILE),
      loadLabels(TEST_LABELS_FILE),
    ]);
    this.trainSize = this.dataset[0].length;
    this.testSize = this.dataset[2].length;
  }

  getTrainData() {
    return this.getData_(true);
  }

  getTestData() {
    return this.getData_(false);
  }

  getData_(isTrainingData) {
    let imagesIndex;
    let labelsIndex;
    if (isTrainingData) {
      imagesIndex = 0;
      labelsIndex = 1;
    } else {
      imagesIndex = 2;
      labelsIndex = 3;
    }
    const size = this.dataset[imagesIndex].length;
    tf.util.assert(
      this.dataset[labelsIndex].length === size,
      `Mismatch in the number of images (${size}) and ` + `the number of labels (${this.dataset[labelsIndex].length})`,
    );

    const imagesShape = [size, IMAGE_HEIGHT, IMAGE_WIDTH, 1];
    const images = new Float32Array(tf.util.sizeFromShape(imagesShape));
    const labels = new Int32Array(tf.util.sizeFromShape([size, 1]));

    let imageOffset = 0;
    let labelOffset = 0;

    for (let i = 0; i < size; ++i) {
      images.set(this.dataset[imagesIndex][i], imageOffset);
      labels.set(this.dataset[labelsIndex][i], labelOffset);
      imageOffset += IMAGE_FLAT_SIZE;
      labelOffset += 1;
    }

    return {
      images: tf.tensor4d(images, imagesShape),
      labels: tf.oneHot(tf.tensor1d(labels, 'int32'), LABEL_FLAT_SIZE).toFloat(),
    };
  }
}

export const dataset = new NumberDataset();
