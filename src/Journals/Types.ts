import { Resource } from '@/Resource/Types';

export interface JournalPayload {
  title: string;
}

export type JournalResource = Resource<JournalPayload>;

export interface UserJournalsPayload {
  journals: ReadonlyArray<JournalResource>;
}
