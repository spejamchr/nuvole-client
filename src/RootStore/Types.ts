import { AppyError } from '@/Appy';
import { Link, Resource } from '@/Resource/Types';

export interface RootPayload {}

export type RootResource = Resource<RootPayload>;

export interface Waiting {
  kind: 'waiting';
}

export interface Loading {
  kind: 'loading';
  link: Link;
}

export interface Ready {
  kind: 'ready';
  resource: RootResource;
}

export type RootError = AppyError;

export interface Error {
  kind: 'error';
  error: RootError;
}

export type State = Waiting | Loading | Ready | Error;

export const waiting = (): Waiting => ({ kind: 'waiting' });

export const loading = (link: Link): Loading => ({ kind: 'loading', link });

export const ready = (resource: RootResource): Ready => ({ kind: 'ready', resource });

export const error = (error: AppyError): Error => ({ kind: 'error', error });
