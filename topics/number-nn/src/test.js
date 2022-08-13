import { readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dataset } from './dataset.js';
import * as tf from '@tensorflow/tfjs-node-gpu';

const __dirname = dirname(fileURLToPath(import.meta.url));

const modelDirPath = join(__dirname, '..', 'model');

const getModelPath = async () => {
  const content = await readdir(modelDirPath, { withFileTypes: true });

  for (const item of content) {
    if (item.isDirectory()) {
      return join(modelDirPath, item.name);
    }
  }

  throw new Error('model is not found');
};

const test = async () => {
  const modelPath = await getModelPath();
  const modelJsonPath = join(modelPath, 'model.json');

  const model = await tf.loadLayersModel(`file://${modelJsonPath}`);

  model.compile({ optimizer: 'rmsprop', loss: 'categoricalCrossentropy', metrics: ['accuracy'] });

  await dataset.loadData();

  const { images, labels } = dataset.getTestData();

  const result = model.evaluate(images, labels);

  console.log(`
Evaluation result:
Loss = ${result[0].dataSync()[0]};
Accuracy = ${result[1].dataSync()[0]};
`);
};

test();
