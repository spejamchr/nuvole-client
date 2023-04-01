import { resourceDecoder } from '@/Resource/Decoders';
import Decoder, { dateISO, field, number, string, succeed } from 'jsonous';
import { sessionLifetimeMs, UserSession, UserSessionResource } from './Types';

export const userSessionDecoder: Decoder<UserSession> = succeed({})
  .assign('jwt', field('jwt', string))
  .assign('expiresAt', field('expires_at', dateISO))
  .assign('lifetimeInMs', ({ expiresAt }) => succeed(sessionLifetimeMs({ expiresAt })));

export const userSessionResourceDecoder: Decoder<UserSessionResource> =
  resourceDecoder(userSessionDecoder);

export const cachedUserSessionDecoder: Decoder<UserSession> = succeed({})
  .assign('jwt', field('jwt', string))
  .assign('expiresAt', field('expiresAt', dateISO))
  .assign('lifetimeInMs', field('lifetimeInMs', number));

export const cachedUserSessionResourceDecoder: Decoder<UserSessionResource> =
  resourceDecoder(cachedUserSessionDecoder);
