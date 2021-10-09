import { createScript, createRunInTopicHandler } from './utils/script.mjs';

const script = createScript({
  name: 'install',
  handler: async (ctx) => {
    await createRunInTopicHandler('npm', ['install', ...ctx.filteredArgv])(ctx);
  },
});

script();
