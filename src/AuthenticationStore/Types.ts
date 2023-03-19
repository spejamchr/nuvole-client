import { AppyError } from '@/Appy';
import { Link, Resource } from '@/Resource/Types';
import { fromEmpty, just } from 'maybeasy';

export interface AuthenticationPayload {
  email: string;
  password: string;
}

export interface Waiting {
  kind: 'waiting';
}

export interface FormEntry extends AuthenticationPayload {
  kind: 'form-entry';
}

export interface FormReady extends AuthenticationPayload {
  kind: 'form-ready';
}

export interface Authenticating extends AuthenticationPayload {
  kind: 'authenticating';
  submitTo: Link;
}

export type AuthenticationError = AppyError;

export interface AuthenticatingError extends AuthenticationPayload {
  kind: 'authenticating-error';
  error: AuthenticationError;
}

export interface UserSession {
  jwt: string;
  expires: string;
}

export type UserSessionResource = Resource<UserSession>;

export interface Authenticated {
  kind: 'authenticated';
  session: UserSessionResource;
}

export type State =
  | Waiting
  | FormEntry
  | FormReady
  | Authenticating
  | AuthenticatingError
  | Authenticated;

export const waiting = (): Waiting => ({ kind: 'waiting' });

export const formEntry = (email?: string, password?: string): FormEntry => ({
  kind: 'form-entry',
  email: email || '',
  password: password || '',
});

export const formReady = (email: string, password: string): FormReady => ({
  kind: 'form-ready',
  email,
  password,
});

export const usingForm = (email: string, password: string): FormEntry | FormReady =>
  just({})
    .assign('email', fromEmpty(email))
    .assign('password', fromEmpty(password))
    .cata<FormEntry | FormReady>({
      Just: ({ email, password }) => formReady(email, password),
      Nothing: () => formEntry(email, password),
    });

export const authenticating = (
  submitTo: Link,
  email: string,
  password: string,
): Authenticating => ({
  kind: 'authenticating',
  submitTo,
  email,
  password,
});

export const authenticatingError = (
  error: AuthenticationError,
  email: string,
  password: string,
): AuthenticatingError => ({
  kind: 'authenticating-error',
  email,
  password,
  error,
});

export const authenticated = (session: UserSessionResource): Authenticated => ({
  kind: 'authenticated',
  session,
});
