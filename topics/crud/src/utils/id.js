function* idGeneratorFactory() {
  let lastId = 0;

  while (true) {
    yield ++lastId;
  }
}

export const createIdGenerator = () => {
  const generator = idGeneratorFactory();

  return {
    nextId: () => generator.next().value,
  };
};

export const globalIdGenerator = createIdGenerator();
