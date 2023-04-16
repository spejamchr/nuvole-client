import { assertNever } from '@/AssertNever';
import { loading, loadingError, ready, waiting } from '@/CommonStates';
import { LoadError, Ready } from '@/CommonStates/Types';
import { logMisfiredState } from '@/LogMisfiredState';
import { Link, Resource } from '@/Resource/Types';
import { makeAutoObservable } from 'mobx';
import { err, ok, Result } from 'resulty';
import { State } from './Types';

export default class ReadStore<T> {
  public state: State<T>;

  constructor() {
    this.state = waiting();
    makeAutoObservable(this);
  }

  misfiredState = (action: string): void => logMisfiredState('ReadStore', action, this.state);

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

  ready = (resource: Resource<T>) => {
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

  get resource(): Result<Exclude<State<T>, Ready<T>>, Resource<T>> {
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
