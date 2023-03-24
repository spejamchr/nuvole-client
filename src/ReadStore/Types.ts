import { AppyError } from '@/Appy';
import { FailedDecoder } from '@/CooperExt';
import { Link, Resource } from '@/Resource/Types';
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
  resource: Resource<T>;
}

export type State<T> = Waiting<T> | Loading<T> | Ready<T> | LoadingError;

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

export const ready = <T>(resource: Resource<T>): Ready<T> => ({
  kind: 'ready',
  resource,
});
