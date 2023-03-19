import { assertNever } from '@/AssertNever';
import { UserSessionResource } from '@/AuthenticationStore/Types';
import { Nullish } from '@/CooperExt';
import { logMisfiredState } from '@/LogMisfiredState';
import { just, Maybe, nothing } from 'maybeasy';
import { makeAutoObservable } from 'mobx';
import {
  readingStorage,
  ReadError,
  State,
  readingStorageError,
  waiting,
  withSession,
  withoutSession,
  writingSession,
  writingSessionError,
  WriteError,
} from './Types';

class SessionStore {
  public state: State;

  constructor() {
    this.state = waiting();
    makeAutoObservable(this);
  }

  misfiredState = (action: string): void => logMisfiredState('SessionStore', action, this.state);

  readingStorage = (): void => {
    switch (this.state.kind) {
      case 'waiting':
        this.state = readingStorage();
        break;
      case 'reading-storage':
      case 'reading-storage-error':
      case 'without-session':
      case 'with-session':
      case 'writing-session':
      case 'writing-session-error':
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
      case 'without-session':
      case 'with-session':
      case 'writing-session':
      case 'writing-session-error':
        this.misfiredState('readingStorageError');
        break;
      default:
        assertNever(this.state);
    }
  };

  withoutSession = (): void => {
    switch (this.state.kind) {
      case 'reading-storage':
        this.state = withoutSession();
        break;
      case 'waiting':
      case 'reading-storage-error':
      case 'without-session':
      case 'with-session':
      case 'writing-session':
      case 'writing-session-error':
        this.misfiredState('withoutSession');
        break;
      default:
        assertNever(this.state);
    }
  };

  withSession = (session: UserSessionResource): void => {
    switch (this.state.kind) {
      case 'reading-storage':
        this.state = withSession(session);
        break;
      case 'waiting':
      case 'reading-storage-error':
      case 'without-session':
      case 'with-session':
      case 'writing-session':
      case 'writing-session-error':
        this.misfiredState('withSession');
        break;
      default:
        assertNever(this.state);
    }
  };

  finishedWritingSession = (): void => {
    switch (this.state.kind) {
      case 'writing-session':
        this.state = withSession(this.state.session);
        break;
      case 'waiting':
      case 'reading-storage':
      case 'reading-storage-error':
      case 'without-session':
      case 'with-session':
      case 'writing-session-error':
        this.misfiredState('finishedWritingSession');
        break;
      default:
        assertNever(this.state);
    }
  };

  writingSession = (session: UserSessionResource): void => {
    switch (this.state.kind) {
      case 'waiting':
      case 'without-session':
      case 'reading-storage-error':
      case 'writing-session-error':
      case 'reading-storage':
        // The writingSession transition can happen at any time from the AuthenticationStore
        this.state = writingSession(session);
        break;
      case 'writing-session':
        this.misfiredState('writingSession');
        break;
      case 'with-session':
        if (session.payload.jwt !== this.state.session.payload.jwt) {
          this.state = writingSession(session);
        }
        break;
      default:
        assertNever(this.state);
    }
  };

  writingSessionError = (error: WriteError): void => {
    switch (this.state.kind) {
      case 'writing-session':
        this.state = writingSessionError(this.state.session, error);
        break;
      case 'waiting':
      case 'reading-storage':
      case 'reading-storage-error':
      case 'without-session':
      case 'with-session':
      case 'writing-session-error':
        this.misfiredState('writingSession');
        break;
      default:
        assertNever(this.state);
    }
  };

  get session(): Maybe<UserSessionResource> {
    switch (this.state.kind) {
      case 'waiting':
      case 'reading-storage':
      case 'reading-storage-error':
      case 'without-session':
        return nothing();
      case 'with-session':
      case 'writing-session':
      case 'writing-session-error':
        return just(this.state.session);
    }
  }
}

export const sessionStore = new SessionStore();
