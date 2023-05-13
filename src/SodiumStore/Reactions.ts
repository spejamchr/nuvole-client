import { warn } from '@/Logging';
import Reactor from '@/Reactor';
import { assertNever } from '@kofno/piper';
import libsodium from 'libsodium-wrappers';
import Task from 'taskarian';
import sodiumStore from '.';

const Reactions = Reactor<typeof sodiumStore>(({ store }) => (state) => {
  switch (state.kind) {
    case 'waiting':
      store.resolvingPromise();
      break;
    case 'resolving-promise':
      Task.fromPromise(() => libsodium.ready).fork(store.resolvingError, () =>
        store.usable(libsodium),
      );
      break;
    case 'resolving-error':
      warn('Could not prepare libsodium library', JSON.stringify(state.error));
      break;
    case 'usable':
      break;
    default:
      assertNever(state);
  }
});

export default Reactions;
