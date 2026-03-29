import { Codex } from '@openai/codex-sdk';
import { Console } from 'node:console';

const console = new Console({ stdout: process.stdout, stderr: process.stderr, inspectOptions: { depth: Infinity } });
const codex = new Codex();
const thread = codex.startThread();

const turn = await thread.runStreamed(
  'Can you make a simple web research with less than 5 web_search tools about best joke?',
);

for await (const message of turn.events) {
  console.log(message);
}
