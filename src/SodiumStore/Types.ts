import { Waiting } from '@/CommonStates/Types';
import libsodium from 'libsodium-wrappers';

export interface ResolvingPromise {
  kind: 'resolving-promise';
}

export interface ResolvingError {
  kind: 'resolving-error';
  error: unknown;
}

export interface Usable {
  kind: 'usable';
  sodium: typeof libsodium;
}

export type State = Waiting | ResolvingPromise | ResolvingError | Usable;

export const resolvingPromise = (): ResolvingPromise => ({ kind: 'resolving-promise' });

export const resolvingError = (error: unknown): ResolvingError => ({
  kind: 'resolving-error',
  error,
});

export const usable = (sodium: typeof libsodium): Usable => ({ kind: 'usable', sodium: sodium });
