import { manyPerformaneTest } from '../../utils/performance.mjs';

class DeepClone {
  isPrimitive(target) {
    return typeof target !== 'object' || target === null;
  }

  clonePrimitive(target) {
    return target;
  }

  isArray(target) {
    return Array.isArray(target);
  }

  cloneArray(target) {
    return target.reduce((result, value) => {
      result.push(this.clone(value));

      return result;
    }, []);
  }

  isObject(target) {
    return typeof target === 'object' && target !== null;
  }

  cloneObject(target) {
    const keys = Object.keys(target);

    return keys.reduce((result, key) => {
      const value = target[key];
      result[key] = this.clone(value);

      return result;
    }, {});
  }

  clone(target) {
    if (this.isPrimitive(target)) {
      return this.clonePrimitive(target);
    }

    if (this.isArray(target)) {
      return this.cloneArray(target);
    }

    if (this.isObject(target)) {
      return this.cloneObject(target);
    }
  }
}

const deepClone = new DeepClone();

const target = {
  name: 'bob',
  age: 22,
  isBlocked: false,
  payment: null,
  sessions: [{ id: 1 }, { id: 2 }, { id: 3 }],
  hello: () => {},
};

const RUN_COUNT = 10;

const main = async () => {
  const result = await manyPerformaneTest({
    target: () => deepClone.clone(target),
    runCount: RUN_COUNT,
    averageResult: () => 'not needs',
  });

  console.log(result);
};

main();
