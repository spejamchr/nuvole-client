import { AppyError } from '@/Appy';
import { FailedDecoder } from '@/CooperExt';
import { Link, Resource } from '@/Resource/Types';
import { NoCurrentSession } from '@/SessionStore/Types';
import { Maybe } from 'maybeasy';

export interface CurrentUserPayload {
  publicReferenceToken: string;
  email: string;
  name: Maybe<string>;
  findableByPrt: boolean;
  findableByEmail: boolean;
  findableByName: boolean;
  journalCount: number;
  entryCount: number;
  joinedAt: Date;
}

export type CurrentUserResource = Resource<CurrentUserPayload>;

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
  currentUser: CurrentUserResource;
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

export const ready = (currentUser: CurrentUserResource): Ready => ({
  kind: 'ready',
  currentUser,
});
