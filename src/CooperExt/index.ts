import { identity, noop } from '@kofno/piper';
import Decoder, { array } from 'jsonous';
import { Result, err, Catamorphism, ok } from 'resulty';
import Task from 'taskarian';

export const andTryR = <E, A, F, B>(
  fn: (a: A) => Result<F, B>,
): Catamorphism<E, A, Result<E | F, B>> => ({
  Ok: fn,
  Err: err,
});

export const andTryT = <E, A, F, B>(task: Task<E, A>, fn: (a: A) => Task<F, B>): Task<E | F, B> =>
  task.mapError<E | F>(identity).andThen(fn);

export interface Raised {
  kind: 'raised';
  error: unknown;
}

const raised = (error: unknown): Raised => ({ kind: 'raised', error });

export const fromRaisableR = <A>(fn: () => A | never): Result<Raised, A> => {
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

export const fromNullishR = <A>(a: A | null | undefined): Result<Nullish, A> =>
  a === undefined || a === null ? err(nullish) : ok(a);

export interface ValueIsFalse {
  kind: 'value-is-false';
}

const valueIsFalse: ValueIsFalse = { kind: 'value-is-false' };

export const fromBooleanR = <A>(predicate: boolean, value: A): Result<ValueIsFalse, A> =>
  predicate ? ok(value) : err(valueIsFalse);

export interface FailedDecoder {
  kind: 'failed-decoder';
  msg: string;
}

const failedDecoder = (msg: string): FailedDecoder => ({ kind: 'failed-decoder', msg });

export const fromJsonDecoderR =
  <A>(fn: (json: string) => Result<string, A>) =>
  (json: string): Result<FailedDecoder, A> =>
    fn(json).mapError(failedDecoder);

export const resultToTask = <E, A>(fn: () => Result<E, A>): Task<E, A> =>
  new Task((Err, Ok) => {
    fn().cata({ Err, Ok });
    return noop;
  });

export const readonlyArray = <T>(decoder: Decoder<T>): Decoder<ReadonlyArray<T>> =>
  array(decoder).map<ReadonlyArray<T>>(identity);
