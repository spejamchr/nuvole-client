import { Resource } from '@/Resource/Types';

export interface Journal {
  title: string;
}

export type JournalResource = Resource<Journal>;

export interface UserJournals {
  journals: ReadonlyArray<JournalResource>;
}
