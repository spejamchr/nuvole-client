import { assertNever } from '@/AssertNever';
import Reactor from '@/Reactor';
import { findLink } from '@/Resource/Types';
import { rootStore } from '@/RootStore';
import { AuthFormStore } from './Types';

interface Props {
  authFormStore: AuthFormStore;
}

const RootStoreAuthLinkReactions = Reactor<typeof rootStore, Props>(
  ({ authFormStore }) =>
    (state) => {
      switch (state.kind) {
        case 'waiting':
        case 'loading':
        case 'error':
          break;
        case 'ready':
          findLink('authenticate')(state.resource.links).do(authFormStore.loading);
          break;
        default:
          assertNever(state);
      }
    },
);

export default RootStoreAuthLinkReactions;
