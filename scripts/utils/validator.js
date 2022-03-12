export class ValidatorError extends Error {}

const compileMsg = (template, props) => {
  const keys = Object.keys(props);

  return keys.reduce((finalMsg, key) => {
    const value = props[key];

    return finalMsg.replace(`{${key}}`, value);
  }, template);
};

export const validator = (name) => {
  const rules = [];

  const state = {
    is: (rule) => {
      rules.push(rule);

      return state;
    },
    validate: async ({ value }) => {
      for (const rule of rules) {
        const { isPassed, msg } = await Promise.resolve(rule(value));

        if (isPassed === false) {
          throw new ValidatorError(compileMsg(msg, { name }));
        }
      }
    },
  };

  return state;
};

export const createRule = ({ errorMsg: defaultErrorMsg, test }) => {
  return ({ errorMsg: template = defaultErrorMsg, ...rest } = {}) => {
    return async (value) => {
      const props = { ...rest, value };
      const isPassed = await Promise.resolve(test(props));
      const msg = compileMsg(template, props);

      return { isPassed, msg };
    };
  };
};

export const string = createRule({
  errorMsg: '{name} is not a string',
  test: ({ value }) => typeof value === 'string',
});

export const minLength = createRule({
  errorMsg: '{name} is less than {min}',
  test: ({ value }) => value.length < min,
});

export const maxLength = createRule({
  errorMsg: '{name} is more than {max}',
  test: ({ value }) => value.length > max,
});

export const length = createRule({
  errorMsg: '{name} length is not {length}',
  test: ({ value }) => value.length === length,
});

export const regexp = createRule({
  errorMsg: '{name} failed regexp test',
  test: ({ regexp }) => regexp.test(value),
});
