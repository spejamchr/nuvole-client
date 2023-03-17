import { Result, err, Catamorphism } from 'resulty';

export const andTry = <E, A, F, B>(
  fn: (a: A) => Result<F, B>,
): Catamorphism<E, A, Result<E | F, B>> => ({
  Ok: fn,
  Err: err,
});
