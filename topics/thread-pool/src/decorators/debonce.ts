export const Debonce =
  (ms: number, initIsBlocked = false): MethodDecorator =>
  (target, key, descriptor) => {
    const original = descriptor.value as unknown as () => void;
    const copy = { ...descriptor } as TypedPropertyDescriptor<() => void>;

    let isBloked = initIsBlocked;
    let timeout: NodeJS.Timeout;

    copy.value = function handler(...args) {
      if (isBloked) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          isBloked = false;
          handler.call(this, ...args);
        }, ms);
        return;
      }

      isBloked = true;
      return original.call(this, ...args);
    };

    return copy as unknown as typeof descriptor;
  };
