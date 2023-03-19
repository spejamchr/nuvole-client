import { resourceDecoder } from '@/Resource/Decoders';
import Decoder, { dateISO, field, string, succeed } from 'jsonous';
import { UserSession, UserSessionResource } from './Types';

export const userSessionDecoder: Decoder<UserSession> = succeed({})
  .assign('jwt', field('jwt', string))
  .assign('expires', field('expires', dateISO))
  .assign('lifetimeInMs', ({ expires }) => succeed(expires.valueOf() - new Date().valueOf()));

export const userSessionResourceDecoder: Decoder<UserSessionResource> =
  resourceDecoder(userSessionDecoder);
