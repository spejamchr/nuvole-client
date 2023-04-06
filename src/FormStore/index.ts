import { assertNever } from '@/AssertNever';
import { logMisfiredState } from '@/LogMisfiredState';
import { Link, Resource, ResourceForm } from '@/Resource/Types';
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
  submitted,
} from './Types';

export default class FormStore<
  FormPayload,
  Response extends Resource<unknown> = ResourceForm<FormPayload>,
> {
  public state: State<FormPayload, Response>;

  constructor() {
    this.state = waiting();
    makeAutoObservable(this);
  }

  misfiredState = (action: string): void => logMisfiredState('FormStore', action, this.state);

  loading = (link: Link) => {
    switch (this.state.kind) {
      case 'waiting':
        this.state = loading(link);
        break;
      case 'loading':
      case 'ready':
      case 'loading-error':
      case 'submitting':
      case 'submitting-error':
      case 'submitted':
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
      case 'submitted':
        this.misfiredState('loadingError');
        break;
      default:
        assertNever(this.state);
    }
  };

  ready = (resource: ResourceForm<FormPayload>) => {
    switch (this.state.kind) {
      case 'loading':
      case 'submitting':
      case 'submitted':
        this.state = ready(resource);
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

  submitting = (resource: ResourceForm<FormPayload>) => {
    switch (this.state.kind) {
      case 'ready':
      case 'submitting-error':
      case 'submitted':
        this.state = submitting(resource);
        break;
      case 'waiting':
      case 'loading':
      case 'loading-error':
      case 'submitting':
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
      case 'submitted':
        this.misfiredState('ready');
        break;
      default:
        assertNever(this.state);
    }
  };

  submitted = (response: Response) => {
    switch (this.state.kind) {
      case 'submitting':
        this.state = submitted(response);
        break;
      case 'waiting':
      case 'loading':
      case 'loading-error':
      case 'ready':
      case 'submitting-error':
      case 'submitted':
        this.misfiredState('ready');
        break;
      default:
        assertNever(this.state);
    }
  };

  get resource(): Result<
    Exclude<State<FormPayload, Response>, Ready<FormPayload>>,
    ResourceForm<FormPayload>
  > {
    switch (this.state.kind) {
      case 'waiting':
      case 'loading':
      case 'loading-error':
      case 'submitting':
      case 'submitting-error':
      case 'submitted':
        return err(this.state);
      case 'ready':
        return ok(this.state.resource);
    }
  }

  get submittable(): boolean {
    switch (this.state.kind) {
      case 'waiting':
      case 'loading':
      case 'loading-error':
      case 'submitting':
        return false;
      case 'ready':
      case 'submitting-error':
      case 'submitted':
        return true;
    }
  }
}
