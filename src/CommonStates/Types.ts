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

export interface Ready<T, R extends Resource<T> = Resource<T>> {
  kind: 'ready';
  resource: R;
}
