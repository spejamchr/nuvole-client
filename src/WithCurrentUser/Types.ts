import { Resource } from '@/Resource/Types';
import { Maybe } from 'maybeasy';

export interface CurrentUser {
  publicReferenceToken: string;
  email: string;
  name: Maybe<string>;
  findableByPrt: boolean;
  findableByEmail: boolean;
  findableByName: boolean;
  journalCount: number;
  entryCount: number;
  joinedAt: Date;
}

export type CurrentUserResource = Resource<CurrentUser>;
