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

export interface Ready<F> {
  kind: 'ready';
  resource: ResourceForm<F>;
}

export interface Submitting<F> {
  kind: 'submitting';
  resource: ResourceForm<F>;
}

export interface ValidationError {
  kind: 'validation-error';
}

export const validationError = (): ValidationError => ({
  kind: 'validation-error',
});

export type SubmitError = ValidationError | MissingLink | AppyError | FailedDecoder;

export interface SubmittingError<F> {
  kind: 'submitting-error';
  resource: ResourceForm<F>;
  error: SubmitError;
}

export interface Submitted<S extends Resource<unknown>> {
  kind: 'submitted';
  resource: S;
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

export const ready = <F>(resource: ResourceForm<F>): Ready<F> => ({
  kind: 'ready',
  resource,
});

export const submitting = <F>(resource: ResourceForm<F>): Submitting<F> => ({
  kind: 'submitting',
  resource,
});

export const submittingError = <F>(
  resource: ResourceForm<F>,
  error: SubmitError,
): SubmittingError<F> => ({
  kind: 'submitting-error',
  resource,
  error,
});

export const submitted = <S extends Resource<unknown>>(resource: S): Submitted<S> => ({
  kind: 'submitted',
  resource,
});
