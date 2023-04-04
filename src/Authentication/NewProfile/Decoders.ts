import Decoder, { succeed } from 'jsonous';
import { NewProfilePayload } from './Types';

export const newProfilePayloadDecoder: Decoder<NewProfilePayload> = succeed({});
