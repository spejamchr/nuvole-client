export const assertNever = (thing: never): never => {
  throw new Error(`Expected never, but got a thing: ${JSON.stringify(thing)}`);
};
