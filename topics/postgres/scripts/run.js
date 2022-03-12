import { fileURLToPath } from 'node:url';
import { createScript } from '../../../scripts/utils/script.js';
import { getTopicContent, topicExist } from './utils/topic.js';
import { validator, string } from '../../../scripts/utils/validator.js';
import { run } from './utils/sql.js';

export const runScriptOptions = {
  name: 'postgres:run',
  argsSchema: [validator('topic').is(string()).is(topicExist())],
  handler: async ({ args: [topic], logger }) => {
    logger.log(`sql execution started`);

    const sqlCode = await getTopicContent(topic);
    await run(sqlCode);

    logger.log(`sql execution finished`);
  },
};

const script = createScript(runScriptOptions);

const __MAIN__ = process.argv[1] === fileURLToPath(import.meta.url);

if (__MAIN__) {
  script();
}
