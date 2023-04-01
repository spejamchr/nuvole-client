import { AppyError } from '@/Appy';
import { FailedDecoder } from '@/CooperExt';
import { Link, MissingLink, Resource, ResourceForm } from '@/Resource/Types';
import { NoCurrentSession } from '@/SessionStore/Types';

export interface Waiting {
  kind: 'waiting';
}

export interface Loading {
  kind: 'loading';
  link: Link;
}

export type LoadError = NoCurrentSession | AppyError | FailedDecoder;

export interface LoadingError {
  kind: 'loading-error';
  error: LoadError;
}

export interface Ready<T> {
  kind: 'ready';
  resource: ResourceForm<T>;
}

export interface Submitting<T> {
  kind: 'submitting';
  resource: ResourceForm<T>;
}

export type SubmitError = MissingLink | AppyError | FailedDecoder;

export interface SubmittingError<T> {
  kind: 'submitting-error';
  resource: ResourceForm<T>;
  error: SubmitError;
}

export interface Submitted<S extends Resource<unknown>> {
  kind: 'submitted';
  response: S;
}

export type State<F, S extends Resource<unknown> = ResourceForm<F>> =
  | Waiting
  | Loading
  | LoadingError
  | Ready<F>
  | Submitting<F>
  | SubmittingError<F>
  | Submitted<S>;

export const waiting = (): Waiting => ({
  kind: 'waiting',
});

export const loading = (link: Link): Loading => ({
  kind: 'loading',
  link,
});

export const loadingError = (error: LoadError): LoadingError => ({
  kind: 'loading-error',
  error,
});

export const ready = <T>(resource: ResourceForm<T>): Ready<T> => ({
  kind: 'ready',
  resource,
});

export const submitting = <T>(resource: ResourceForm<T>): Submitting<T> => ({
  kind: 'submitting',
  resource,
});

export const submittingError = <T>(
  resource: ResourceForm<T>,
  error: SubmitError,
): SubmittingError<T> => ({
  kind: 'submitting-error',
  resource,
  error,
});

export const submitted = <S extends Resource<unknown>>(response: S): Submitted<S> => ({
  kind: 'submitted',
  response,
});
