type Method = () => void;

export const log = () => {
  return (target: Object, key: string, descriptor: TypedPropertyDescriptor<Method>): TypedPropertyDescriptor<Method> | void => {
    if (!descriptor.value) return;

    return {
      ...descriptor,
      value: () => {
        console.log('before log');
        descriptor?.value?.();
        console.log('after log');
      },
    }
  }
}