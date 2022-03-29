import { Strategy } from './strategy/strategy';

export class StrategyRegistry {
  private static strategies: Map<string, Strategy> = new Map();

  static setStrategy(key: string, strategy: Strategy) {
    this.strategies.set(key, strategy);
  }

  static getStrategy(key: string) {
    return this.strategies.get(key);
  }
}
