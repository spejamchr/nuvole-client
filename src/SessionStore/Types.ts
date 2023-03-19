import { UserSessionResource } from '@/AuthenticationStore/Types';
import { FailedDecoder } from '@/CooperExt';
import { GetItemError, SetItemError } from '@/Storage';

export interface Waiting {
  kind: 'waiting';
}

export interface ReadingStorage {
  kind: 'reading-storage';
}

export type ReadError = GetItemError | FailedDecoder;

export interface ReadingStorageError {
  kind: 'reading-storage-error';
  error: ReadError;
}

export interface WithoutSession {
  kind: 'without-session';
}

export interface WithSession {
  kind: 'with-session';
  session: UserSessionResource;
}

export interface WritingSession {
  kind: 'writing-session';
  session: UserSessionResource;
}

export type WriteError = SetItemError;

export interface WritingSessionError {
  kind: 'writing-session-error';
  session: UserSessionResource;
  error: WriteError;
}

export type State =
  | Waiting
  | ReadingStorage
  | ReadingStorageError
  | WithoutSession
  | WithSession
  | WritingSession
  | WritingSessionError;

export const waiting = (): Waiting => ({ kind: 'waiting' });

export const readingStorage = (): ReadingStorage => ({ kind: 'reading-storage' });

export const readingStorageError = (error: ReadError): ReadingStorageError => ({
  kind: 'reading-storage-error',
  error,
});

export const withoutSession = (): WithoutSession => ({ kind: 'without-session' });

export const withSession = (session: UserSessionResource): WithSession => ({
  kind: 'with-session',
  session,
});

export const writingSession = (session: UserSessionResource): WritingSession => ({
  kind: 'writing-session',
  session,
});

export const writingSessionError = (
  session: UserSessionResource,
  error: WriteError,
): WritingSessionError => ({
  kind: 'writing-session-error',
  session,
  error,
});
