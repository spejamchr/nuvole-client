import { Resource } from '@/Resource/Types';

export interface PublicKeyPayload {
  key: string;
  label: string;
}

export type PublicKeyResource = Resource<PublicKeyPayload>;

export interface PublicKeysPayload {
  publicKeys: ReadonlyArray<PublicKeyResource>;
}

export type PublicKeysResource = Resource<PublicKeysPayload>;
