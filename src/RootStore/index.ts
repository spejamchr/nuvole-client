import { AppyError } from '@/Appy';
import { assertNever } from '@/AssertNever';
import { makeAutoObservable } from 'mobx';
import { err, ok, Result } from 'resulty';
import { error, loading, Ready, ready, RootResource, State, waiting } from './Types';

const rootHref = 'http://localhost:3000/root.json';

class RootStore {
  public state: State;

  constructor() {
    this.state = waiting();
    makeAutoObservable(this);
  }

  loading = () => {
    switch (this.state.kind) {
      case 'waiting':
        this.state = loading({
          rel: 'self',
          href: rootHref,
          method: 'get',
          type: 'application/json',
        });
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
