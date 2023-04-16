import { Link, Resource } from '@/Resource/Types';
import { LoadError, Loading, LoadingError, Ready, Waiting } from './Types';

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

export const ready = <T, R extends Resource<T> = Resource<T>>(resource: R): Ready<T, R> => ({
  kind: 'ready',
  resource,
});
