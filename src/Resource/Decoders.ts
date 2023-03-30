import { readonlyArray } from '@/CooperExt';
import { explicitMaybe, stringLiteral } from '@execonline-inc/decoders';
import { resourceDecoder as resourceDecoderR } from '@execonline-inc/resource';
import { identity } from '@kofno/piper';
import Decoder, { boolean, dateISO, field, number, oneOf, string, succeed } from 'jsonous';
import {
  Access,
  ApiForm,
  BaseInput,
  BooleanInput,
  DateInput,
  Input,
  Rel,
  rels,
  Resource,
  ResourceForm,
  StringInput,
} from './Types';

export const relDecoder: Decoder<Rel> = oneOf(rels.map(stringLiteral));

export const resourceDecoder: <T>(decoder: Decoder<T>) => Decoder<Resource<T>> = resourceDecoderR(
  relDecoder.toAnyFn(),
);

export const accessDecoder: Decoder<Access> = oneOf<Access>([
  stringLiteral<Access>('readonly'),
  stringLiteral<Access>('writeable'),
  stringLiteral<Access>('required'),
]);

export const baseInputDecoder = <K extends Input['kind']>(kind: K): Decoder<BaseInput<K>> =>
  succeed({})
    .assign('kind', field('kind', stringLiteral(kind)))
    .assign('name', field('name', string))
    .assign('label', field('label', string))
    .assign('access', field('access', accessDecoder));

export const stringInputDecoder: Decoder<StringInput> = baseInputDecoder('string')
  .assign('minLength', field('min_length', number))
  .assign('maxLength', field('max_length', number))
  .assign('value', field('value', string));

export const booleanInputDecoder: Decoder<BooleanInput> = baseInputDecoder('boolean').assign(
  'value',
  field('value', boolean),
);

export const dateInputDecoder: Decoder<DateInput> = baseInputDecoder('date')
  .assign('min', field('min', explicitMaybe(dateISO)))
  .assign('max', field('max', explicitMaybe(dateISO)))
  .assign('value', field('value', explicitMaybe(dateISO)));

export const inputDecoder: Decoder<Input> = oneOf<Input>([
  stringInputDecoder.map<Input>(identity),
  booleanInputDecoder.map<Input>(identity),
  dateInputDecoder.map<Input>(identity),
]);

export const apiFormDecoder: Decoder<ApiForm> = succeed({})
  .assign('name', field('name', string))
  .assign('actionRel', field('action_rel', relDecoder))
  .assign('inputs', field('inputs', readonlyArray(inputDecoder)));

export const resourceFormDecoder = <T>(decoder: Decoder<T>): Decoder<ResourceForm<T>> =>
  resourceDecoder(decoder).assign('form', field('form', apiFormDecoder));
