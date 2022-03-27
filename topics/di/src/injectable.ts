import { Registry } from './registry';

export const Injectable = (): ClassDecorator => {
  return (target) => {
    Registry.register(target);
  };
};
