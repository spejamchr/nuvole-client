import { andTryR, fromNullishR, fromRaisableR, Nullish, Raised } from '@/CooperExt';
import { Result } from 'resulty';

export type GetItemError = Raised | Nullish;

export const getItem = (key: string): Result<GetItemError, string> =>
  fromRaisableR(() => localStorage.getItem(key)).cata(andTryR(fromNullishR));

export type SetItemError = Raised;

export const setItem = (key: string, value: string): Result<SetItemError, void> =>
  fromRaisableR(() => localStorage.setItem(key, value));

export type RemoveItemError = Raised;

export const removeItem = (key: string): Result<RemoveItemError, void> =>
  fromRaisableR(() => localStorage.removeItem(key));
