import { assertNever } from '@/AssertNever';
import { logMisfiredState } from '@/LogMisfiredState';
import { Link } from '@/Resource/Types';
import { makeAutoObservable } from 'mobx';
import {
  authenticated,
  authenticating,
  authenticatingError,
  AuthenticationError,
  formEntry,
  State,
  UserSessionResource,
  usingForm,
  waiting,
} from './Types';

class AuthenticationStore {
  public state: State;

  constructor() {
    this.state = waiting();
    makeAutoObservable(this);
  }

  misfiredState = (action: string): void =>
    logMisfiredState('AuthenticationStore', action, this.state);

  formEntry = (): void => {
    switch (this.state.kind) {
      case 'waiting':
        this.state = formEntry();
        break;
      case 'form-entry':
      case 'form-ready':
      case 'authenticating':
      case 'authenticating-error':
      case 'authenticated':
        // noop
        break;
      default:
        assertNever(this.state);
    }
  };

  setEmail = (email: string): void => {
    switch (this.state.kind) {
      case 'form-entry':
      case 'form-ready':
      case 'authenticating-error':
        this.state = usingForm(email, this.state.password);
        break;
      case 'waiting':
      case 'authenticating':
      case 'authenticated':
        this.misfiredState('setEmail');
        break;
      default:
        assertNever(this.state);
    }
  };

  setPassword = (password: string): void => {
    switch (this.state.kind) {
      case 'form-entry':
      case 'form-ready':
      case 'authenticating-error':
        this.state = usingForm(this.state.email, password);
        break;
      case 'waiting':
      case 'authenticating':
      case 'authenticated':
        this.misfiredState('setPassword');
        break;
      default:
        assertNever(this.state);
    }
  };

  authenticating = (submitTo: Link): void => {
    switch (this.state.kind) {
      case 'form-ready':
        this.state = authenticating(submitTo, this.state.email, this.state.password);
        break;
      case 'form-entry':
      case 'authenticating-error':
      case 'waiting':
      case 'authenticating':
      case 'authenticated':
        this.misfiredState('authenticating');
        break;
      default:
        assertNever(this.state);
    }
  };

  authenticatingError = (error: AuthenticationError): void => {
    switch (this.state.kind) {
      case 'authenticating':
        this.state = authenticatingError(error, this.state.email, this.state.password);
        break;
      case 'waiting':
      case 'form-ready':
      case 'form-entry':
      case 'authenticating-error':
      case 'authenticated':
        this.misfiredState('authenticatingError');
        break;
      default:
        assertNever(this.state);
    }
  };

  authenticated = (session: UserSessionResource): void => {
    switch (this.state.kind) {
      case 'authenticating':
        this.state = authenticated(session);
        break;
      case 'waiting':
      case 'form-ready':
      case 'form-entry':
      case 'authenticating-error':
      case 'authenticated':
        this.misfiredState('authenticated');
        break;
      default:
        assertNever(this.state);
    }
  };

  get email(): string {
    switch (this.state.kind) {
      case 'waiting':
        return '';
      case 'authenticating':
      case 'form-ready':
      case 'form-entry':
      case 'authenticating-error':
        return this.state.email;
      case 'authenticated':
        return this.state.session.payload.email;
    }
  }

  get password(): string {
    switch (this.state.kind) {
      case 'waiting':
      case 'authenticated':
        return '';
      case 'authenticating':
      case 'form-ready':
      case 'form-entry':
      case 'authenticating-error':
        return this.state.password;
    }
  }
}

export const authenticationStore = new AuthenticationStore();
