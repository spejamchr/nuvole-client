import { resourceDecoder } from '@/Resource/Decoders';
import Decoder, { succeed } from 'jsonous';
import { RootPayload, RootResource } from './Types';

const rootPayloadDecoder: Decoder<RootPayload> = succeed({});

export const rootResourceDecoder: Decoder<RootResource> = resourceDecoder(rootPayloadDecoder);
