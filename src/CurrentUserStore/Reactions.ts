import { callAuthenticatedApi } from '@/Appy';
import { assertNever } from '@/AssertNever';
import { error } from '@/Logging';
import Reactor from '@/Reactor';
import { Link } from '@/Resource/Types';
import Task from 'taskarian';
import CurrentUserStore from '.';
import { currentUserResourceDecoder } from './Decoder';
import { LoadError } from './Types';

const fetchCurrentUser = callAuthenticatedApi(currentUserResourceDecoder, {});

const CurrentUserStoreReactions = Reactor<CurrentUserStore>((store) => (state) => {
  switch (state.kind) {
    case 'waiting':
      break;
    case 'loading':
      Task.succeed<LoadError, Link>(state.link)
        .andThen(fetchCurrentUser)
        .fork(store.loadingError, store.ready);
      break;
    case 'loading-error':
      error('Error loading CurrentUser endpoint:', JSON.stringify(state.error));
      break;
    case 'ready':
      break;
    default:
      assertNever(state);
  }
});

export default CurrentUserStoreReactions;
