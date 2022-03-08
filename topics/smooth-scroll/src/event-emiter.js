export class EventEmitter {
  state = {};

  onFactory(isOnce = false) {
    return (event, handler) => {
      if (!this.state[event]) {
        this.state[event] = [];
      }

      this.state[event].push({ handler, isOnce });
    };
  }

  on = this.onFactory(false);
  once = this.onFactory(true);

  off(event, handler) {
    const handlers = this.state[event];
    if (!handlers) {
      return;
    }

    this.state[event] = handlers.filter(({ handler: innerHandler }) => handler !== innerHandler);
  }

  emit(event, ...values) {
    const handlers = this.state[event];
    if (!handlers) {
      return;
    }

    for (const { handler, isOnce } of handlers) {
      handler(values);

      if (isOnce) {
        this.off(event, handler);
      }
    }
  }
}
