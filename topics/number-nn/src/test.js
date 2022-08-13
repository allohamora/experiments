import { dataset } from './dataset.js';
import { getSavedModel } from './model.js';

const test = async () => {
  const model = await getSavedModel();

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
