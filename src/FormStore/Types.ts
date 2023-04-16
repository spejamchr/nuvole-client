import { AppyError } from '@/Appy';
import { Loading, LoadingError, Ready, Waiting } from '@/CommonStates/Types';
import { FailedDecoder } from '@/CooperExt';
import { MissingLink, Resource, ResourceForm } from '@/Resource/Types';

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
  | Ready<FormPayload, ResourceForm<FormPayload>>
  | Submitting<FormPayload>
  | SubmittingError<FormPayload>
  | Submitted<Response>;

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
