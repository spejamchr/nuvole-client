import { resultToTask } from '@/CooperExt';
import { findR } from '@execonline-inc/collections';
import { Link as LinkR, Resource as ResourceR } from '@execonline-inc/resource';
import { always, pipe } from '@kofno/piper';
import { Maybe } from 'maybeasy';
import { Result } from 'resulty';

export const rels = [
  'authenticate',
  'block',
  'create',
  'create_user',
  'destroy',
  'entries',
  'form',
  'journals',
  'parent',
  'self',
  'subscribe',
  'template:user',
  'update',
  'user',
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
}

export type StringInputType = 'email' | 'password' | 'search' | 'tel' | 'text' | 'url';

export interface StringInput extends BaseInput<'string'> {
  minLength: Maybe<number>;
  maxLength: Maybe<number>;
  value: string;
  type: StringInputType;
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
