import { createScript, createRunInTopicHandler } from './utils/script.mjs';

const script = createScript({
  name: 'start',
  handler: createRunInTopicHandler('npm', ['run', 'start']),
});

script();
