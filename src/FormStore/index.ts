import { assertNever } from '@/AssertNever';
import { logMisfiredState } from '@/LogMisfiredState';
import { Link, ResourceForm } from '@/Resource/Types';
import Decoder from 'jsonous';
import { makeAutoObservable } from 'mobx';
import { err, ok, Result } from 'resulty';
import {
  loadingError,
  loading,
  Ready,
  ready,
  State,
  waiting,
  LoadError,
  submitting,
  SubmitError,
  submittingError,
} from './Types';

export default class ReadStore<T> {
  public state: State<T>;

  constructor(decoder: Decoder<T>) {
    this.state = waiting(decoder);
    makeAutoObservable(this);
  }

  misfiredState = (action: string): void => logMisfiredState('ReadStore', action, this.state);

  loading = (link: Link) => {
    switch (this.state.kind) {
      case 'waiting':
        this.state = loading(link, this.state.decoder);
        break;
      case 'loading':
      case 'ready':
      case 'loading-error':
      case 'submitting':
      case 'submitting-error':
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
      case 'submitting':
      case 'submitting-error':
        this.misfiredState('loadingError');
        break;
      default:
        assertNever(this.state);
    }
  };

  ready = (resource: ResourceForm<T>) => {
    switch (this.state.kind) {
      case 'loading':
      case 'submitting':
        this.state = ready(resource, this.state.decoder);
        break;
      case 'waiting':
      case 'ready':
      case 'loading-error':
      case 'submitting-error':
        this.misfiredState('ready');
        break;
      default:
        assertNever(this.state);
    }
  };

  submitting = (resource: ResourceForm<T>) => {
    switch (this.state.kind) {
      case 'ready':
        this.state = submitting(resource, this.state.decoder);
        break;
      case 'waiting':
      case 'loading':
      case 'loading-error':
      case 'submitting':
      case 'submitting-error':
        this.misfiredState('ready');
        break;
      default:
        assertNever(this.state);
    }
  };

  submittingError = (error: SubmitError) => {
    switch (this.state.kind) {
      case 'submitting':
        this.state = submittingError(this.state.resource, error);
        break;
      case 'waiting':
      case 'loading':
      case 'loading-error':
      case 'ready':
      case 'submitting-error':
        this.misfiredState('ready');
        break;
      default:
        assertNever(this.state);
    }
  };

  get resource(): Result<Exclude<State<T>, Ready<T>>, ResourceForm<T>> {
    switch (this.state.kind) {
      case 'waiting':
      case 'loading':
      case 'loading-error':
      case 'submitting':
      case 'submitting-error':
        return err(this.state);
      case 'ready':
        return ok(this.state.resource);
    }
  }
}
