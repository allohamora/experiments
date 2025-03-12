import { scheduler } from 'node:timers/promises';

class State {
  constructor(value) {
    this.value = value;
  }

  getValue() {
    return this.value;
  }

  setValue(value) {
    this.value = value;
  }
}

class Lock {
  isActive = false;
  queue = [];

  async enter() {
    return new Promise((resolve) => {
      const start = () => {
        this.isActive = true;
        resolve(null);
      };

      if (!this.isActive) {
        start();
        return;
      }

      this.queue.push(start);
    });
  }

  leave() {
    if (!this.isActive) return;
    this.isActive = false;

    const next = this.queue.shift();
    next?.();
  }

  async runInLock(fn) {
    try {
      await this.enter();
      return await fn();
    } finally {
      this.leave();
    }
  }
}

const deposit = async (amount, balance) => {
  const value = balance.getValue();

  await scheduler.wait(Math.random() * 100);

  balance.setValue(value + amount);
};

const main = async () => {
  const balance = new State(0);
  await Promise.all(Array.from({ length: 10 }, async () => await deposit(100, balance)));

  const lockBalance = new State(0);
  const lock = new Lock();
  await Promise.all(Array.from({ length: 10 }, async () => await lock.runInLock(() => deposit(100, lockBalance))));

  console.log({ balance: balance.getValue(), lockBalance: lockBalance.getValue() });
};

void main();
