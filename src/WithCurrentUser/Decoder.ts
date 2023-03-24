import { explicitMaybe } from '@execonline-inc/decoders';
import Decoder, { boolean, dateISO, field, number, string, succeed } from 'jsonous';
import { CurrentUser } from './Types';

export const currentUserDecoder: Decoder<CurrentUser> = succeed({})
  .assign('publicReferenceToken', field('public_reference_token', string))
  .assign('email', field('email', string))
  .assign('name', field('name', explicitMaybe(string)))
  .assign('findableByPrt', field('findable_by_prt', boolean))
  .assign('findableByEmail', field('findable_by_email', boolean))
  .assign('findableByName', field('findable_by_name', boolean))
  .assign('journalCount', field('journal_count', number))
  .assign('entryCount', field('entry_count', number))
  .assign('joinedAt', field('joined_at', dateISO));
