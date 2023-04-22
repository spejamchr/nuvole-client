import { waiting } from '@/CommonStates';
import { assertNever } from '@kofno/piper';
import libsodium from 'libsodium-wrappers';
import { makeAutoObservable } from 'mobx';
import { State, resolvingError, resolvingPromise, usable } from './Types';

class SodiumStore {
  public state: State;

  constructor() {
    this.state = waiting();
    makeAutoObservable(this);
  }

  resolvingPromise = (): void => {
    switch (this.state.kind) {
      case 'waiting':
        this.state = resolvingPromise();
        break;
      case 'resolving-promise':
      case 'resolving-error':
      case 'usable':
        break;
      default:
        assertNever(this.state);
    }
  };

  resolvingError = (error: unknown): void => {
    switch (this.state.kind) {
      case 'resolving-promise':
        this.state = resolvingError(error);
        break;
      case 'waiting':
      case 'resolving-error':
      case 'usable':
        break;
      default:
        assertNever(this.state);
    }
  };

  usable = (sodium: typeof libsodium): void => {
    switch (this.state.kind) {
      case 'resolving-promise':
        this.state = usable(sodium);
        break;
      case 'waiting':
      case 'resolving-error':
      case 'usable':
        break;
      default:
        assertNever(this.state);
    }
  };
}

const sodiumStore = new SodiumStore();

export default sodiumStore;
