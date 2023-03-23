import { assertNever } from '@/AssertNever';
import { authenticationStore } from '@/AuthenticationStore';
import { UserSessionResource, whenActiveSession } from '@/AuthenticationStore/Types';
import { Nullish } from '@/CooperExt';
import { logMisfiredState } from '@/LogMisfiredState';
import { makeAutoObservable } from 'mobx';
import { err, ok, Result } from 'resulty';
import {
  NoCurrentSession,
  noCurrentSession,
  ReadError,
  readingStorage,
  readingStorageError,
  RefreshError,
  refreshingSession,
  refreshingSessionError,
  State,
  waiting,
  withoutSession,
  withSession,
  WriteError,
  writingSession,
  writingSessionError,
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
      case 'refreshing-session':
      case 'refreshing-session-error':
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
      case 'refreshing-session':
      case 'refreshing-session-error':
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
      case 'refreshing-session':
      case 'refreshing-session-error':
        this.misfiredState('withoutSession');
        break;
      default:
        assertNever(this.state);
    }
  };

  withSession = (session: UserSessionResource): void => {
    switch (this.state.kind) {
      case 'reading-storage':
      case 'refreshing-session':
        this.state = withSession(session);
        break;
      case 'waiting':
      case 'reading-storage-error':
      case 'without-session':
      case 'with-session':
      case 'writing-session':
      case 'writing-session-error':
      case 'refreshing-session-error':
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
      case 'refreshing-session':
      case 'refreshing-session-error':
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
      case 'refreshing-session':
      case 'refreshing-session-error':
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
      case 'refreshing-session':
      case 'refreshing-session-error':
        this.misfiredState('writingSession');
        break;
      default:
        assertNever(this.state);
    }
  };

  refreshingSession = (): void => {
    switch (this.state.kind) {
      case 'with-session':
      case 'writing-session':
      case 'writing-session-error':
      case 'refreshing-session-error':
        this.state = refreshingSession(this.state.session);
        break;
      case 'refreshing-session':
        // Noop
        break;
      case 'waiting':
      case 'reading-storage':
      case 'reading-storage-error':
      case 'without-session':
        this.misfiredState('refreshingSession');
        break;
      default:
        assertNever(this.state);
    }
  };

  refreshingSessionError = (error: RefreshError): void => {
    switch (this.state.kind) {
      case 'refreshing-session':
        this.state = refreshingSessionError(this.state.session, error);
        break;
      case 'waiting':
      case 'reading-storage':
      case 'reading-storage-error':
      case 'without-session':
      case 'with-session':
      case 'writing-session':
      case 'writing-session-error':
      case 'refreshing-session-error':
        this.misfiredState('refreshingSessionError');
        break;
      default:
        assertNever(this.state);
    }
  };

  logout = (): void => {
    switch (this.state.kind) {
      case 'waiting':
      case 'reading-storage':
      case 'with-session':
      case 'writing-session':
      case 'writing-session-error':
      case 'refreshing-session':
      case 'refreshing-session-error':
        this.state = withoutSession();
        authenticationStore.logout();
        break;
      case 'reading-storage-error':
      case 'without-session':
        this.misfiredState('logout');
        break;
      default:
        assertNever(this.state);
    }
  };

  session = (): Result<NoCurrentSession, UserSessionResource> => {
    switch (this.state.kind) {
      case 'waiting':
      case 'reading-storage':
      case 'reading-storage-error':
      case 'without-session':
        return err(noCurrentSession());
      case 'with-session':
      case 'writing-session':
      case 'writing-session-error':
      case 'refreshing-session':
      case 'refreshing-session-error':
        return whenActiveSession(this.state.session).mapError(noCurrentSession);
    }
  };

  get sessionExpiration(): Result<NoCurrentSession, Date> {
    switch (this.state.kind) {
      case 'waiting':
      case 'reading-storage':
      case 'reading-storage-error':
      case 'without-session':
        return err(noCurrentSession());
      case 'with-session':
      case 'writing-session':
      case 'writing-session-error':
      case 'refreshing-session':
      case 'refreshing-session-error':
        return ok(this.state.session.payload.expiresAt);
    }
  }
}

export const sessionStore = new SessionStore();
