import { resourceDecoder } from '@/Resource/Decoders';
import Decoder, { field, string, succeed } from 'jsonous';
import { UserSession, UserSessionResource } from './Types';

export const userSessionDecoder: Decoder<UserSession> = succeed({})
  .assign('jwt', field('jwt', string))
  .assign('expires', field('expires', string));

export const userSessionResourceDecoder: Decoder<UserSessionResource> =
  resourceDecoder(userSessionDecoder);
