import { andTry, fromNullish, fromRaisable, Nullish, Raised } from '@/CooperExt';
import { Result } from 'resulty';

export type GetItemError = Raised | Nullish;

export const getItem = (key: string): Result<GetItemError, string> =>
  fromRaisable(() => localStorage.getItem(key)).cata(andTry(fromNullish));

export type SetItemError = Raised;

export const setItem = (key: string, value: string): Result<SetItemError, void> =>
  fromRaisable(() => localStorage.setItem(key, value));

export type RemoveItemError = Raised;

export const removeItem = (key: string): Result<RemoveItemError, void> =>
  fromRaisable(() => localStorage.removeItem(key));
