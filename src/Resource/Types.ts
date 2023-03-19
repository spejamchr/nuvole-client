import { resultToTask } from '@/CooperExt';
import { findR } from '@execonline-inc/collections';
import { Link as LinkR, Resource as ResourceR } from '@execonline-inc/resource';
import { always, pipe } from '@kofno/piper';
import { Result } from 'resulty';

export const rels = [
  'authenticate',
  'block',
  'create',
  'create_user',
  'destroy',
  'entries',
  'journals',
  'parent',
  'self',
  'subscribe',
  'template:user',
  'update',
  'user',
  'user_blocks',
  'user_subscriptions',
] as const;

export type Rel = (typeof rels)[number];

export type Link = LinkR<Rel>;
export type Resource<T> = ResourceR<T, Rel>;

export interface MissingLink {
  kind: 'missing-link';
  rel: Rel;
}

export const missingLink = (rel: Rel): MissingLink => ({ kind: 'missing-link', rel });

export const findLink =
  (rel: Rel) =>
  (links: ReadonlyArray<Link>): Result<MissingLink, Link> =>
    findR<Link>((link) => link.rel === rel)(links).mapError(() => missingLink(rel));

export const findLinkT = (rel: Rel) => pipe(findLink(rel), always, resultToTask);
