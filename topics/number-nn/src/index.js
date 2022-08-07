import * as tf from '@tensorflow/tfjs-node-gpu';
import path from 'node:path';
import { dataset } from './dataset.js';

const MODEL_OUTPUT_BASE_PATH = 'model';

const main = async () => {
  const filename = Date.now();

  const model = tf.sequential({
    layers: [
      tf.layers.conv2d({
        inputShape: [28, 28, 1],
        filters: 32,
        kernelSize: 3,
        activation: 'relu',
      }),
      tf.layers.conv2d({
        filters: 32,
        kernelSize: 3,
        activation: 'relu',
      }),
      tf.layers.conv2d({
        filters: 64,
        kernelSize: 3,
        activation: 'relu',
      }),
      tf.layers.conv2d({
        filters: 64,
        kernelSize: 3,
        activation: 'relu',
      }),
      tf.layers.maxPooling2d({ poolSize: [2, 2] }),
      tf.layers.flatten(),
      tf.layers.dropout({ rate: 0.25 }),
      tf.layers.dense({ units: 512, activation: 'relu' }),
      tf.layers.dropout({ rate: 0.5 }),
      tf.layers.dense({ units: 10, activation: 'softmax' }),
    ],
  });

  model.compile({ optimizer: 'rmsprop', loss: 'categoricalCrossentropy', metrics: ['accuracy'] });

  model.summary();

  await dataset.loadData();

  const { images, labels } = dataset.getTrainData();

  await model.fit(images, labels, { epochs: 10 });

  const modelSavePath = path.join(MODEL_OUTPUT_BASE_PATH, filename);

  await model.save(`file://${modelSavePath}`);

  console.log(`Saved model to path: ${modelSavePath}`);
};

main();
