import { AppyError } from '@/Appy';
import { FailedDecoder } from '@/CooperExt';
import { Link, MissingLink, ResourceForm } from '@/Resource/Types';
import { NoCurrentSession } from '@/SessionStore/Types';
import Decoder from 'jsonous';

export interface Waiting<T> {
  kind: 'waiting';
  decoder: Decoder<T>;
}

export interface Loading<T> {
  kind: 'loading';
  link: Link;
  decoder: Decoder<T>;
}

export type LoadError = NoCurrentSession | AppyError | FailedDecoder;

export interface LoadingError {
  kind: 'loading-error';
  error: LoadError;
}

export interface Ready<T> {
  kind: 'ready';
  resource: ResourceForm<T>;
  decoder: Decoder<T>;
}

export interface Submitting<T> {
  kind: 'submitting';
  resource: ResourceForm<T>;
  decoder: Decoder<T>;
}

export type SubmitError = MissingLink | NoCurrentSession | AppyError | FailedDecoder;

export interface SubmittingError<T> {
  kind: 'submitting-error';
  resource: ResourceForm<T>;
  error: SubmitError;
}

export type State<T> =
  | Waiting<T>
  | Loading<T>
  | LoadingError
  | Ready<T>
  | Submitting<T>
  | SubmittingError<T>;

export const waiting = <T>(decoder: Decoder<T>): Waiting<T> => ({
  kind: 'waiting',
  decoder,
});

export const loading = <T>(link: Link, decoder: Decoder<T>): Loading<T> => ({
  kind: 'loading',
  link,
  decoder,
});

export const loadingError = (error: LoadError): LoadingError => ({
  kind: 'loading-error',
  error,
});

export const ready = <T>(resource: ResourceForm<T>, decoder: Decoder<T>): Ready<T> => ({
  kind: 'ready',
  resource,
  decoder,
});

export const submitting = <T>(resource: ResourceForm<T>, decoder: Decoder<T>): Submitting<T> => ({
  kind: 'submitting',
  resource,
  decoder,
});

export const submittingError = <T>(
  resource: ResourceForm<T>,
  error: SubmitError,
): SubmittingError<T> => ({
  kind: 'submitting-error',
  resource,
  error,
});
