import { readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
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

export const getSavedModel = async () => {
  const modelPath = await getModelPath();
  const modelJsonPath = join(modelPath, 'model.json');

  const model = await tf.loadLayersModel(`file://${modelJsonPath}`);

  model.compile({ optimizer: 'rmsprop', loss: 'categoricalCrossentropy', metrics: ['accuracy'] });

  return model;
};
