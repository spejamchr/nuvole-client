import { callApi } from '@/Appy';
import { assertNever } from '@/AssertNever';
import Reactor from '@/Reactor';
import { rootResourceDecoder } from './Decoders';
import { rootStore } from '.';
import { error } from '@/Logging';

const fetchRoot = callApi(rootResourceDecoder, {});

const Reactions = Reactor<typeof rootStore>(({ store }) => (state) => {
  switch (state.kind) {
    case 'waiting':
      store.loading();
      break;
    case 'loading':
      fetchRoot(state.link).fork(store.error, store.ready);
      break;
    case 'error':
      error('Error loading root uri', state.error.kind);
      break;
    case 'ready':
      break;
    default:
      assertNever(state);
  }
});

export default Reactions;
