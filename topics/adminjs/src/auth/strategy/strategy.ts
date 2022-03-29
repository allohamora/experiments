import { ExecutionContext } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { StrategyRegistry } from '../strategy.registry';

export abstract class Strategy {
  constructor(name: string) {
    StrategyRegistry.setStrategy(name, this);
  }

  public abstract validate(context: ExecutionContext): User | Promise<User>;
}
