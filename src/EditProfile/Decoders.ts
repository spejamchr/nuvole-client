import Decoder, { succeed } from 'jsonous';
import { EditProfilePayload } from './Types';

export const editProfilePayloadDecoder: Decoder<EditProfilePayload> = succeed({});
