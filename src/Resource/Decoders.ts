import { stringLiteral } from '@execonline-inc/decoders';
import { resourceDecoder as resourceDecoderR } from '@execonline-inc/resource';
import Decoder, { oneOf } from 'jsonous';
import { Rel, rels, Resource } from './Types';

export const relDecoder: Decoder<Rel> = oneOf(rels.map(stringLiteral));

export const resourceDecoder: <T>(decoder: Decoder<T>) => Decoder<Resource<T>> = resourceDecoderR(
  relDecoder.toAnyFn(),
);
