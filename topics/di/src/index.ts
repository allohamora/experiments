import 'reflect-metadata';
import { Injectable } from './injectable';
import { Registry } from './registry';

@Injectable()
class PingService {
  constructor() {
    console.log('ping service created');
  }

  public ping() {
    return 'pong';
  }
}

@Injectable()
class PingModule {
  constructor(private pingService: PingService) {
    console.log('ping module created');
  }

  public ping() {
    return `module ${this.pingService.ping()}`;
  }
}

@Injectable()
class NestedPingModule {
  constructor(private pingModule: PingModule) {
    console.log('another ping module created');
  }

  public ping() {
    return `nested ${this.pingModule.ping()}`;
  }
}

const main = () => {
  const pingService = Registry.get(PingService);
  const pingModule = Registry.get(PingModule);
  const nestedPingModule = Registry.get(NestedPingModule);

  console.log(pingService.ping());
  console.log(pingModule.ping());
  console.log(nestedPingModule.ping());
};

main();
