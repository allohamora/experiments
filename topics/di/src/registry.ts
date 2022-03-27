interface Constructor<A extends unknown[] = unknown[], I = {}> {
  new (...args: A): I;
}

export class Registry {
  private static unresolved: Set<Function> = new Set();
  private static resolved: Map<Function, unknown> = new Map();

  static register(target: Function) {
    this.unresolved.add(target);
  }

  private static resolveParams(parameters: Function[]) {
    return parameters.map((parameter) => {
      if (this.resolved.has(parameter)) {
        return this.resolved.get(parameter);
      }

      return this.resolve(parameter);
    });
  }

  private static resolve(target: Function) {
    const parameters: Function[] | undefined = Reflect.getMetadata('design:paramtypes', target);
    const constructor = target as Constructor;

    let value: unknown;

    if (!parameters) {
      value = new constructor();
    } else {
      value = new constructor(...this.resolveParams(parameters));
    }

    this.unresolved.delete(target);
    this.resolved.set(target, value);

    return value;
  }

  static set<T extends unknown>(target: Function, value: T) {
    this.resolved.set(target, value);
  }

  static get<T extends Constructor, V extends InstanceType<T>>(target: T): V {
    const isResolved = this.resolved.has(target);
    const isUnresolved = this.unresolved.has(target);

    if (!isResolved && !isUnresolved) {
      throw new Error(`unknown target: ${target.name}`);
    }

    if (isUnresolved) {
      return this.resolve(target) as V;
    }

    if (isResolved) {
      return this.resolved.get(target) as V;
    }
  }
}
