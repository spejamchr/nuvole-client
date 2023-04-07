import { readonlyArray } from '@/CooperExt';
import { resourceDecoder } from '@/Resource/Decoders';
import Decoder, { field, string, succeed } from 'jsonous';
import {
  PublicKeyPayload,
  PublicKeyResource,
  PublicKeysPayload,
  PublicKeysResource,
} from './Types';

export const publicKeyPayloadDecoder: Decoder<PublicKeyPayload> = succeed({})
  .assign('key', field('key', string))
  .assign('label', field('label', string));

export const publicKeyResourceDecoder: Decoder<PublicKeyResource> =
  resourceDecoder(publicKeyPayloadDecoder);

export const publicKeysPayloadDecoder: Decoder<PublicKeysPayload> = succeed({}).assign(
  'publicKeys',
  field('public_keys', readonlyArray(publicKeyResourceDecoder)),
);

export const publicKeysResourceDecoder: Decoder<PublicKeysResource> =
  resourceDecoder(publicKeysPayloadDecoder);
