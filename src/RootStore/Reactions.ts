import { callApi } from '@/Appy';
import { assertNever } from '@/AssertNever';
import Reactor from '@/Reactor';
import { rootResourceDecoder } from './Decoders';
import RootStore from '.';
import { State } from './Types';

const fetchRoot = callApi(rootResourceDecoder, {});

class Reactions extends Reactor<RootStore> {
  effect =
    (store: RootStore) =>
    (state: State): void => {
      switch (state.kind) {
        case 'waiting':
          break;
        case 'loading':
          fetchRoot(state.link).fork(store.error, store.ready);
          break;
        case 'error':
          console.error('Error loading root uri', state.error.kind);
          break;
        case 'ready':
          break;
        default:
          assertNever(state);
      }
    };
}

export default Reactions;
