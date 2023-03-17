import { AppyError } from '@/Appy';
import { assertNever } from '@/AssertNever';
import { Link } from '@/Resource/Types';
import { makeAutoObservable } from 'mobx';
import { err, ok, Result } from 'resulty';
import { error, loading, Ready, ready, RootResource, State, waiting } from './Types';

class RootStore {
  public state: State;

  constructor() {
    this.state = waiting();
    makeAutoObservable(this);
  }

  loading = (link: Link) => {
    switch (this.state.kind) {
      case 'waiting':
        this.state = loading(link);
        break;
      case 'loading':
      case 'ready':
      case 'error':
        break;
      default:
        assertNever(this.state);
    }
  };

  ready = (resource: RootResource) => {
    switch (this.state.kind) {
      case 'waiting':
        break;
      case 'loading':
        this.state = ready(resource);
        break;
      case 'ready':
      case 'error':
        break;
      default:
        assertNever(this.state);
    }
  };

  error = (appyError: AppyError) => {
    this.state = error(appyError);
  };

  get resource(): Result<Exclude<State, Ready>, RootResource> {
    switch (this.state.kind) {
      case 'waiting':
      case 'loading':
      case 'error':
        return err(this.state);
      case 'ready':
        return ok(this.state.resource);
    }
  }
}

export const rootStore = new RootStore();
