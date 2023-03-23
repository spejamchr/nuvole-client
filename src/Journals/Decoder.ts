import { readonlyArray } from '@/CooperExt';
import { resourceDecoder } from '@/Resource/Decoders';
import Decoder, { field, string, succeed } from 'jsonous';
import { JournalPayload, JournalResource, UserJournalsPayload } from './Types';

export const journalPayloadDecoder: Decoder<JournalPayload> = succeed({}).assign(
  'title',
  field('title', string),
);

export const journalResourceDecoder: Decoder<JournalResource> =
  resourceDecoder(journalPayloadDecoder);

export const userJournalsPayloadDecoder: Decoder<UserJournalsPayload> = succeed({}).assign(
  'journals',
  field('journals', readonlyArray(journalResourceDecoder)),
);
