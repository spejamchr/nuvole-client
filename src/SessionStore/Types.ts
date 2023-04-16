import { Waiting } from '@/CommonStates/Types';
import { FailedDecoder, fromBooleanR } from '@/CooperExt';
import { Resource } from '@/Resource/Types';
import { GetItemError, SetItemError } from '@/Storage';
import { Result } from 'resulty';

export interface UserSession {
  jwt: string;
  expiresAt: Date;
  lifetimeInMs: number;
}

export type UserSessionResource = Resource<UserSession>;

export const sessionLifetimeMs = ({ expiresAt }: { expiresAt: Date }): number =>
  expiresAt.valueOf() - new Date().valueOf();

const userSessionActive = (session: UserSession): boolean => sessionLifetimeMs(session) > 0;

export const whenActiveSession = (
  resource: UserSessionResource,
): Result<ExpiredSession, UserSessionResource> =>
  fromBooleanR(userSessionActive(resource.payload), resource).mapError(expiredSession);

export const sessionExpiringSoon = ({ expiresAt, lifetimeInMs }: UserSession): boolean =>
  expiresAt.valueOf() - new Date().valueOf() < lifetimeInMs / 2;

export interface ReadingStorage {
  kind: 'reading-storage';
}

export interface ExpiredSession {
  kind: 'expired-session';
}

export const expiredSession = (): ExpiredSession => ({ kind: 'expired-session' });

export type ReadError = GetItemError | FailedDecoder | ExpiredSession;

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

export interface RefreshingSession {
  kind: 'refreshing-session';
  session: UserSessionResource;
}

export type RefreshError = unknown;

export interface RefreshingSessionError {
  kind: 'refreshing-session-error';
  session: UserSessionResource;
  error: RefreshError;
}

export type State =
  | Waiting
  | ReadingStorage
  | ReadingStorageError
  | WithoutSession
  | WithSession
  | WritingSession
  | WritingSessionError
  | RefreshingSession
  | RefreshingSessionError;

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

export const refreshingSession = (session: UserSessionResource): RefreshingSession => ({
  kind: 'refreshing-session',
  session,
});

export const refreshingSessionError = (
  session: UserSessionResource,
  error: RefreshError,
): RefreshingSessionError => ({ kind: 'refreshing-session-error', session, error });

export interface NoCurrentSession {
  kind: 'no-current-session';
}

export const noCurrentSession = (): NoCurrentSession => ({ kind: 'no-current-session' });
