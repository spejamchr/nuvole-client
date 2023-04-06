import { AppyError } from '@/Appy';
import { FailedDecoder } from '@/CooperExt';
import { Link, MissingLink, Resource, ResourceForm } from '@/Resource/Types';
import { NoCurrentSession } from '@/SessionStore/Types';

export interface Waiting {
  kind: 'waiting';
}

export interface Loading {
  kind: 'loading';
  link: Link;
}

export type LoadError = NoCurrentSession | AppyError | FailedDecoder;

export interface LoadingError {
  kind: 'loading-error';
  error: LoadError;
}

export interface Ready<FormPayload> {
  kind: 'ready';
  resource: ResourceForm<FormPayload>;
}

export interface Submitting<FormPayload> {
  kind: 'submitting';
  resource: ResourceForm<FormPayload>;
}

export interface ValidationError {
  kind: 'validation-error';
}

export const validationError = (): ValidationError => ({
  kind: 'validation-error',
});

export type SubmitError = ValidationError | MissingLink | AppyError | FailedDecoder;

export interface SubmittingError<FormPayload> {
  kind: 'submitting-error';
  resource: ResourceForm<FormPayload>;
  error: SubmitError;
}

export interface Submitted<Response extends Resource<unknown>> {
  kind: 'submitted';
  resource: Response;
}

export type State<FormPayload, Response extends Resource<unknown> = ResourceForm<FormPayload>> =
  | Waiting
  | Loading
  | LoadingError
  | Ready<FormPayload>
  | Submitting<FormPayload>
  | SubmittingError<FormPayload>
  | Submitted<Response>;

export const waiting = (): Waiting => ({
  kind: 'waiting',
});

export const loading = (link: Link): Loading => ({
  kind: 'loading',
  link,
});

export const loadingError = (error: LoadError): LoadingError => ({
  kind: 'loading-error',
  error,
});

export const ready = <FormPayload>(resource: ResourceForm<FormPayload>): Ready<FormPayload> => ({
  kind: 'ready',
  resource,
});

export const submitting = <FormPayload>(
  resource: ResourceForm<FormPayload>,
): Submitting<FormPayload> => ({
  kind: 'submitting',
  resource,
});

export const submittingError = <FormPayload>(
  resource: ResourceForm<FormPayload>,
  error: SubmitError,
): SubmittingError<FormPayload> => ({
  kind: 'submitting-error',
  resource,
  error,
});

export const submitted = <Response extends Resource<unknown>>(
  resource: Response,
): Submitted<Response> => ({
  kind: 'submitted',
  resource,
});
