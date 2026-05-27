import { Effect, Console } from 'effect';

const program = Console.log('Hello, Effect Topic!');

Effect.runSync(program);
