import { stringLiteral } from '@execonline-inc/decoders';
import Decoder, { field, oneOf, string, succeed } from 'jsonous';
import { KeyType, StringKeyPair } from 'libsodium-wrappers';

export const keyTypeDecoder: Decoder<KeyType> = oneOf([
  stringLiteral<KeyType>('x25519'),
  stringLiteral<KeyType>('ed25519'),
  stringLiteral<KeyType>('curve25519'),
]);

export const clientKeyDecoder: Decoder<StringKeyPair> = succeed({})
  .assign('keyType', field('type', keyTypeDecoder))
  .assign('publicKey', field('publicKey', string))
  .assign('privateKey', field('privateKey', string));
