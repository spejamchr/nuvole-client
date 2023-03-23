import { AppyError } from '@/Appy';
import { FailedDecoder } from '@/CooperExt';
import { Link, Resource } from '@/Resource/Types';
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
  resource: Resource<T>;
}

export type State<T> = Waiting | Loading | Ready<T> | LoadingError;

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

export const ready = <T>(resource: Resource<T>): Ready<T> => ({
  kind: 'ready',
  resource,
});
