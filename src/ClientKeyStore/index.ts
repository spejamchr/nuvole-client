import { assertNever } from '@/AssertNever';
import { waiting, writingStorage, writingStorageError } from '@/CommonStates';
import { Nullish } from '@/CooperExt';
import { logMisfiredState } from '@/LogMisfiredState';
import { makeAutoObservable } from 'mobx';
import { WriteError } from '@/CommonStates/Types';
import { State, creatingClientKey, withClientKey, withoutClientKey } from './Types';
import { ReadError, readingStorage, readingStorageError } from '@/SessionStore/Types';
import { Usable } from '@/SodiumStore/Types';
import { StringKeyPair } from 'libsodium-wrappers';

class ClientKeyStore {
  public state: State;

  constructor() {
    this.state = waiting();
    makeAutoObservable(this);
  }

  misfiredState = (action: string): void => logMisfiredState('ClientKeyStore', action, this.state);

  readingStorage = (): void => {
    switch (this.state.kind) {
      case 'waiting':
        this.state = readingStorage();
        break;
      case 'reading-storage':
      case 'reading-storage-error':
      case 'without-client-key':
      case 'with-client-key':
      case 'creating-client-key':
      case 'writing-storage':
      case 'writing-storage-error':
        // noop
        break;
      default:
        assertNever(this.state);
    }
  };

  readingStorageError = (error: Exclude<ReadError, Nullish>): void => {
    switch (this.state.kind) {
      case 'reading-storage':
        this.state = readingStorageError(error);
        break;
      case 'waiting':
      case 'reading-storage-error':
      case 'without-client-key':
      case 'with-client-key':
      case 'creating-client-key':
      case 'writing-storage':
      case 'writing-storage-error':
        this.misfiredState('readingStorageError');
        break;
      default:
        assertNever(this.state);
    }
  };

  withoutClientKey = (): void => {
    switch (this.state.kind) {
      case 'reading-storage':
        this.state = withoutClientKey();
        break;
      case 'waiting':
      case 'reading-storage-error':
      case 'without-client-key':
      case 'with-client-key':
      case 'creating-client-key':
      case 'writing-storage':
      case 'writing-storage-error':
        this.misfiredState('withoutClientKey');
        break;
      default:
        assertNever(this.state);
    }
  };

  withClientKey = (clientKey: StringKeyPair): void => {
    switch (this.state.kind) {
      case 'reading-storage':
        this.state = withClientKey(clientKey);
        break;
      case 'waiting':
      case 'reading-storage-error':
      case 'without-client-key':
      case 'with-client-key':
      case 'creating-client-key':
      case 'writing-storage':
      case 'writing-storage-error':
        this.misfiredState('withClientKey');
        break;
      default:
        assertNever(this.state);
    }
  };

  creatingClientKey = (libsodium: Usable): void => {
    switch (this.state.kind) {
      case 'without-client-key':
        this.state = creatingClientKey(libsodium);
        break;
      case 'waiting':
      case 'reading-storage':
      case 'reading-storage-error':
      case 'with-client-key':
      case 'creating-client-key':
      case 'writing-storage':
      case 'writing-storage-error':
        this.misfiredState('creatingClientKey');
        break;
      default:
        assertNever(this.state);
    }
  };

  writingStorage = (clientKey: StringKeyPair): void => {
    switch (this.state.kind) {
      case 'creating-client-key':
        this.state = writingStorage(clientKey);
        break;
      case 'waiting':
      case 'reading-storage':
      case 'reading-storage-error':
      case 'without-client-key':
      case 'writing-storage':
      case 'writing-storage-error':
        this.misfiredState('writingStorage');
        break;
      case 'with-client-key':
        if (clientKey.privateKey !== this.state.clientKey.privateKey) {
          this.state = writingStorage(clientKey);
        }
        break;
      default:
        assertNever(this.state);
    }
  };

  writingStorageError = (error: WriteError): void => {
    switch (this.state.kind) {
      case 'writing-storage':
        this.state = writingStorageError(this.state.object, error);
        break;
      case 'waiting':
      case 'reading-storage':
      case 'reading-storage-error':
      case 'without-client-key':
      case 'with-client-key':
      case 'creating-client-key':
      case 'writing-storage-error':
        this.misfiredState('writingStorageError');
        break;
      default:
        assertNever(this.state);
    }
  };

  finishedWritingClientKey = (): void => {
    switch (this.state.kind) {
      case 'writing-storage':
        this.state = withClientKey(this.state.object);
        break;
      case 'waiting':
      case 'reading-storage':
      case 'reading-storage-error':
      case 'without-client-key':
      case 'with-client-key':
      case 'creating-client-key':
      case 'writing-storage-error':
        this.misfiredState('finishedWritingClientKey');
        break;
      default:
        assertNever(this.state);
    }
  };
}

export const clientKeyStore = new ClientKeyStore();
