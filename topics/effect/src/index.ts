import { Effect, Console } from 'effect';

class Logger extends Effect.Tag('Logger')<Logger, { log: (message: string) => Effect.Effect<void, never, never> }>() {}

const ConsoleLogger = Logger.of({
  log: (message: string) => Console.log(message),
});

const program = Effect.gen(function* () {
  const logger = yield* Logger;
  yield* logger.log('Hello, Effect!');
}).pipe(Effect.provideService(Logger, ConsoleLogger));

Effect.runSync(program);
