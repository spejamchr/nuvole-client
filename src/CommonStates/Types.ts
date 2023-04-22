import { AppyError } from '@/Appy';
import { FailedDecoder } from '@/CooperExt';
import { Link, Resource } from '@/Resource/Types';
import { NoCurrentSession } from '@/SessionStore/Types';
import { SetItemError } from '@/Storage';

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

export interface WritingStorage<T> {
  kind: 'writing-storage';
  object: T;
}

export type WriteError = SetItemError;

export interface WritingStorageError<T> {
  kind: 'writing-storage-error';
  object: T;
  error: WriteError;
}
