import { createScript, createRunInTopicHandler } from "./utils/script.mjs";

const script = createScript({
  name: 'uninstall',
  handler: async (ctx) => {
    await createRunInTopicHandler('npm', ['uninstall', ...ctx.filteredArgv])(ctx);
  }
});

script();