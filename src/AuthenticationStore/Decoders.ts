import { resourceDecoder } from '@/Resource/Decoders';
import Decoder, { dateISO, field, number, string, succeed } from 'jsonous';
import { sessionLifetimeMs, UserSession, UserSessionResource } from './Types';

export const lifetimeDecoder = ({ expires }: { expires: Date }) =>
  field('lifetimeInMs', number).orElse(() => succeed(sessionLifetimeMs({ expires })));

export const userSessionDecoder: Decoder<UserSession> = succeed({})
  .assign('jwt', field('jwt', string))
  .assign('expires', field('expires', dateISO))
  .assign('lifetimeInMs', lifetimeDecoder);

export const userSessionResourceDecoder: Decoder<UserSessionResource> =
  resourceDecoder(userSessionDecoder);
