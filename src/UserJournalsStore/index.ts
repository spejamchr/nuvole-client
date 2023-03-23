import { assertNever } from '@/AssertNever';
import { logMisfiredState } from '@/LogMisfiredState';
import { Link } from '@/Resource/Types';
import { makeAutoObservable } from 'mobx';
import { err, ok, Result } from 'resulty';
import {
  loadingError,
  loading,
  Ready,
  ready,
  UserJournalsResource,
  State,
  waiting,
  LoadError,
} from './Types';

export default class UserJournalsStore {
  public state: State;

  constructor() {
    this.state = waiting();
    makeAutoObservable(this);
  }

  misfiredState = (action: string): void =>
    logMisfiredState('UserJournalsStore', action, this.state);

  loading = (link: Link) => {
    switch (this.state.kind) {
      case 'waiting':
        this.state = loading(link);
        break;
      case 'loading':
      case 'ready':
      case 'loading-error':
        // noop
        break;
      default:
        assertNever(this.state);
    }
  };

  ready = (resource: UserJournalsResource) => {
    switch (this.state.kind) {
      case 'loading':
        this.state = ready(resource);
        break;
      case 'waiting':
      case 'ready':
      case 'loading-error':
        this.misfiredState('ready');
        break;
      default:
        assertNever(this.state);
    }
  };

  loadingError = (error: LoadError) => {
    switch (this.state.kind) {
      case 'loading':
        this.state = loadingError(error);
        break;
      case 'waiting':
      case 'ready':
      case 'loading-error':
        this.misfiredState('loadingError');
        break;
      default:
        assertNever(this.state);
    }
  };

  get resource(): Result<Exclude<State, Ready>, UserJournalsResource> {
    switch (this.state.kind) {
      case 'waiting':
      case 'loading':
      case 'loading-error':
        return err(this.state);
      case 'ready':
        return ok(this.state.resource);
    }
  }
}
