import { getContext, setContext } from '@airlib/core';

export const uIndex = (name: symbol) => {
  let value = getContext<number>(name);

  if (typeof value !== 'number') {
    value = 0;
    setContext(name, value);
  }

  value += 1;
  setContext(name, value);
  return value;
};
