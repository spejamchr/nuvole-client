import { Result, err, Catamorphism, ok } from 'resulty';

export const andTry = <E, A, F, B>(
  fn: (a: A) => Result<F, B>,
): Catamorphism<E, A, Result<E | F, B>> => ({
  Ok: fn,
  Err: err,
});

export interface Raised {
  kind: 'raised';
  error: unknown;
}

const raised = (error: unknown): Raised => ({ kind: 'raised', error });

export const fromRaisable = <A>(fn: () => A | never): Result<Raised, A> => {
  try {
    return ok(fn());
  } catch (e) {
    return err(raised(e));
  }
};

export interface Nullish {
  kind: 'nullish';
}

const nullish: Nullish = { kind: 'nullish' };

export const fromNullish = <A>(a: A | null | undefined): Result<Nullish, A> =>
  a === undefined || a === null ? err(nullish) : ok(a);

export interface FailedDecoder {
  kind: 'failed-decoder';
  msg: string;
}

const failedDecoder = (msg: string): FailedDecoder => ({ kind: 'failed-decoder', msg });

export const fromJsonDecoder =
  <A>(fn: (json: string) => Result<string, A>) =>
  (json: string): Result<FailedDecoder, A> =>
    fn(json).mapError(failedDecoder);
