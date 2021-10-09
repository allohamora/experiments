import { strict } from 'assert';

class Monad<V = null> {
  constructor(private _value: V) {}

  public map<T>(func: (value: NonNullable<V>) => T): Monad<T> {
    const value = this._value;
    if (value === null) return this as unknown as Monad<T>;

    return new Monad(func(value as NonNullable<V>));
  }

  public value(): V | null {
    return this._value;
  }
}

const text = '123';

const notNullable = new Monad({ text })
  .map(({ text }) => ({ data: text }))
  .map(({ data }) => data)
  .value();

strict.deepEqual(notNullable, text);
