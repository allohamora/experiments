import { Effect, Console, Layer } from 'effect';

class Config extends Effect.Tag('Config')<Config, { appName: string }>() {}

const ConfigLive = Layer.succeed(
  Config,
  Config.of({
    appName: 'MyEffectApp',
  }),
);

class Logger extends Effect.Tag('Logger')<Logger, { log: (message: string) => Effect.Effect<void, never, never> }>() {}

const LoggerLive = Layer.effect(
  Logger,
  Effect.gen(function* () {
    const config = yield* Config;
    return Logger.of({
      log: (message: string) => Console.log(`[${config.appName}] ${message}`),
    });
  }),
);

class AppService extends Effect.Tag('AppService')<AppService, { run: () => Effect.Effect<void, never, never> }>() {}

const AppServiceLive = Layer.effect(
  AppService,
  Effect.gen(function* () {
    const logger = yield* Logger;
    return AppService.of({
      run: () => logger.log('Hello from AppService!'),
    });
  }),
);

const ProgramLive = AppServiceLive.pipe(Layer.provideMerge(LoggerLive), Layer.provideMerge(ConfigLive));

const program = Effect.gen(function* () {
  const appService = yield* AppService;
  yield* appService.run();
});

Effect.runSync(program.pipe(Effect.provide(ProgramLive)));
