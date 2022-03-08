const arrayOrValueInArray = (value) => (Array.isArray(value) ? value : [value]);

const subscribeFactory = (method) => (target, eventOrEvents, handlerOrHandlers) => {
  const events = arrayOrValueInArray(eventOrEvents);
  const handlers = arrayOrValueInArray(handlerOrHandlers);

  handlers.forEach((handler) => {
    events.forEach((event) => {
      target[method](event, handler);
    });
  });
};

export const on = subscribeFactory('addEventListener');
export const off = subscribeFactory('removeEventListener');
export const once = (target, event, handler) => {
  const wrapper = (...args) => {
    handler(...args);
    off(target, event, wrapper);
  };

  return on(target, event, wrapper);
};
