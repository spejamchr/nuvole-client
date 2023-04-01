import { assertNever } from '@/AssertNever';
import Reactor from '@/Reactor';
import ReadStore from '@/ReadStore';
import { findLink } from '@/Resource/Types';
import { RootPayload } from '@/RootResource/Types';
import { AuthFormStore } from './Types';

interface Props {
  authFormStore: AuthFormStore;
}

const RootStoreAuthLinkReactions = Reactor<ReadStore<RootPayload>, Props>(
  ({ authFormStore }) =>
    (state) => {
      switch (state.kind) {
        case 'waiting':
        case 'loading':
        case 'loading-error':
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
