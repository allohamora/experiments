import { createScript, createRunInTopicHandler } from "./utils/script.mjs";

const script = createScript({
  name: 'dev',
  handler: createRunInTopicHandler('npm', ['run', 'dev'])
});

script();