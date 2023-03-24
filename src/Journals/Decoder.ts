import { readonlyArray } from '@/CooperExt';
import { resourceDecoder } from '@/Resource/Decoders';
import Decoder, { field, string, succeed } from 'jsonous';
import { Journal, JournalResource, UserJournals } from './Types';

export const journalDecoder: Decoder<Journal> = succeed({}).assign('title', field('title', string));

export const journalResourceDecoder: Decoder<JournalResource> = resourceDecoder(journalDecoder);

export const userJournalsDecoder: Decoder<UserJournals> = succeed({}).assign(
  'journals',
  field('journals', readonlyArray(journalResourceDecoder)),
);
