import { AppyError } from '@/Appy';
import { FailedDecoder } from '@/CooperExt';
import { Link, Resource } from '@/Resource/Types';
import { NoCurrentSession } from '@/SessionStore/Types';

export interface JournalPayload {
  title: string;
}

export type JournalResource = Resource<JournalPayload>;

export interface UserJournalsPayload {
  journals: ReadonlyArray<JournalResource>;
}

export type UserJournalsResource = Resource<UserJournalsPayload>;

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

export interface Ready {
  kind: 'ready';
  resource: UserJournalsResource;
}

export type State = Waiting | Loading | Ready | LoadingError;

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

export const ready = (resource: UserJournalsResource): Ready => ({
  kind: 'ready',
  resource,
});
