import { Link as LinkR, Resource as ResourceR } from '@execonline-inc/resource';

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
