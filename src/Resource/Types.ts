import { resultToTask } from '@/CooperExt';
import { validationError, ValidationError } from '@/FormStore/Types';
import { findR } from '@execonline-inc/collections';
import { when } from '@execonline-inc/maybe-adapter';
import { Link as LinkR, Resource as ResourceR } from '@execonline-inc/resource';
import { always, pipe } from '@kofno/piper';
import { Maybe } from 'maybeasy';
import { err, ok, Result } from 'resulty';

export const rels = [
  'authenticate',
  'block',
  'create',
  'destroy',
  'edit',
  'entries',
  'form',
  'journals',
  'new',
  'new_user',
  'parent',
  'profile',
  'self',
  'subscribe',
  'template:user',
  'update',
  'user_blocks',
  'user_subscriptions',
] as const;

export type Rel = (typeof rels)[number];

export type Link = LinkR<Rel>;
export type Resource<T> = ResourceR<T, Rel>;

export interface MissingLink {
  kind: 'missing-link';
  rel: Rel;
}

export const missingLink = (rel: Rel): MissingLink => ({ kind: 'missing-link', rel });

export const findLink =
  (rel: Rel) =>
  (links: ReadonlyArray<Link>): Result<MissingLink, Link> =>
    findR<Link>((link) => link.rel === rel)(links).mapError(() => missingLink(rel));

export const findLinkT = (rel: Rel) => pipe(findLink(rel), always, resultToTask);

export type Access = 'readonly' | 'writeable' | 'required';

export interface BaseInput<K extends string> {
  kind: K;
  name: string;
  label: string;
  access: Access;
  errors: ReadonlyArray<string>;
}

export type StringInputType = 'email' | 'password' | 'search' | 'tel' | 'text' | 'url';

export interface StringInput extends BaseInput<'string'> {
  minLength: Maybe<number>;
  maxLength: Maybe<number>;
  value: string;
  type: StringInputType;
  pattern: Maybe<RegExp>;
}

export type StringInputApiValue = string;

export interface BooleanInput extends BaseInput<'boolean'> {
  value: boolean;
}

export type BooleanInputApiValue = boolean;

export interface DateInput extends BaseInput<'date'> {
  value: Maybe<Date>;
  min: Maybe<Date>;
  max: Maybe<Date>;
}

export type DateInputApiValue = Maybe<string>;

export type Input = StringInput | BooleanInput | DateInput;

export type InputApiValue = StringInputApiValue | BooleanInputApiValue | DateInputApiValue;

export const inputToApiValue = <I extends Input>(input: I): InputApiValue => {
  switch (input.kind) {
    case 'string':
    case 'boolean':
      return input.value;
    case 'date':
      return input.value.map((d) => d.toISOString());
  }
};

export type ApiFormValues = {
  [S in string]?: InputApiValue;
};

export type ApiFormRequestPayload = {
  [S in string]?: ApiFormValues;
};

export interface ApiForm {
  name: string;
  actionRel: Rel;
  inputs: ReadonlyArray<Input>;
}

export interface HasApiForm {
  form: ApiForm;
}

export type ResourceForm<T> = Resource<T> & HasApiForm;

export const formToApiValues = <F extends HasApiForm>(hasForm: F): ApiFormValues =>
  hasForm.form.inputs.reduce((o, i) => ({ ...o, [i.name]: inputToApiValue(i) }), {});

export const formToApiRequestPayload = <F extends HasApiForm>(
  hasForm: F,
): ApiFormRequestPayload => ({
  [hasForm.form.name]: formToApiValues(hasForm),
});

const stringInputWithValidationErrorMessages = (input: StringInput): StringInput => {
  const errors: Array<string> = [];
  if (input.access === 'required' && input.value.length === 0) {
    errors.push('is required');
  }
  input.minLength.do((min) => {
    if (input.value.length < min) {
      errors.push(`is too short (minimum is ${min} characters)`);
    }
  });
  input.maxLength.do((max) => {
    if (input.value.length > max) {
      errors.push(`is too long (maximum is ${max} characters)`);
    }
  });
  input.pattern.do((pattern) => {
    if (!pattern.test(input.value)) {
      errors.push(`does not match the expected pattern`);
    }
  });
  return { ...input, errors };
};

export const dateInputWithValidationErrorMessages = (input: DateInput): DateInput => {
  const errors: Array<string> = [];

  input.value
    .do((value) => {
      input.min
        .andThen(when((min) => value < min))
        .do((min) => errors.push(`must be greater than or equal to ${min}`));
      input.max
        .andThen(when((max) => value < max))
        .do((max) => errors.push(`must be less than or equal to ${max}`));
    })
    .elseDo(() => {
      if (input.access === 'required') {
        errors.push('is required');
      }
    });

  return { ...input, errors };
};

export const booleanInputWithValidationErrorMessages = (input: BooleanInput): BooleanInput => input;

export const inputWithValidationErrorMessages = (input: Input): Input => {
  switch (input.kind) {
    case 'string':
      return stringInputWithValidationErrorMessages(input);
    case 'date':
      return dateInputWithValidationErrorMessages(input);
    case 'boolean':
      return booleanInputWithValidationErrorMessages(input);
  }
};

export const resourceWithValidationErrorMessages = <F extends HasApiForm>(hasForm: F): F => ({
  ...hasForm,
  form: {
    ...hasForm.form,
    inputs: hasForm.form.inputs.map(inputWithValidationErrorMessages),
  },
});

export const formToValidatedApiValues = <F extends HasApiForm>(
  hasForm: F,
): Result<ValidationError, ApiFormRequestPayload> =>
  resourceWithValidationErrorMessages(hasForm).form.inputs.every((i) => i.errors.length === 0)
    ? ok(formToApiRequestPayload(hasForm))
    : err(validationError());
