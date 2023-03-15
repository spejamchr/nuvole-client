import { AppyError } from '@/Appy';
import { assertNever } from '@/AssertNever';
import { Link } from '@/Resource/Types';
import { makeAutoObservable } from 'mobx';
import { error, loading, ready, RootResource, State, waiting } from './Types';
import { HasState } from '@/Reactor/Types';

class RootStore implements HasState<State> {
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
}

export default RootStore;
