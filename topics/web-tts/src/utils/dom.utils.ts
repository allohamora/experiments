export const querySelector = <T extends Element>(selector: string) => {
  const candidate = document.querySelector<T>(selector);

  if (!candidate) {
    throw new Error(`Element with selector "${selector}" not found`);
  }

  return candidate;
};