import { Waiting, WritingStorage, WritingStorageError } from '@/CommonStates/Types';
import { ReadingStorageError } from '@/SessionStore/Types';
import { ReadingStorage } from '@/SessionStore/Types';
import { Usable } from '@/SodiumStore/Types';
import { StringKeyPair } from 'libsodium-wrappers';

export interface WithoutClientKey {
  kind: 'without-client-key';
}

export interface WithClientKey {
  kind: 'with-client-key';
  clientKey: StringKeyPair;
}

export interface CreatingClientKey {
  kind: 'creating-client-key';
  libsodium: Usable;
}

export type State =
  | Waiting
  | ReadingStorage
  | ReadingStorageError
  | WithoutClientKey
  | WithClientKey
  | CreatingClientKey
  | WritingStorage<StringKeyPair>
  | WritingStorageError<StringKeyPair>;

export const withoutClientKey = (): WithoutClientKey => ({ kind: 'without-client-key' });

export const withClientKey = (clientKey: StringKeyPair): WithClientKey => ({
  kind: 'with-client-key',
  clientKey,
});

export const creatingClientKey = (libsodium: Usable): CreatingClientKey => ({
  kind: 'creating-client-key',
  libsodium,
});
