import { callAuthenticatedApi } from '@/Appy';
import { assertNever } from '@/AssertNever';
import { error } from '@/Logging';
import Reactor from '@/Reactor';
import { Link } from '@/Resource/Types';
import Task from 'taskarian';
import UserJournalsStore from '.';
import { userJournalsResourceDecoder } from './Decoder';
import { LoadError } from './Types';

const fetchUserJournals = callAuthenticatedApi(userJournalsResourceDecoder, {});

const UserJournalsStoreReactions = Reactor<UserJournalsStore>((store) => (state) => {
  switch (state.kind) {
    case 'waiting':
      break;
    case 'loading':
      Task.succeed<LoadError, Link>(state.link)
        .andThen(fetchUserJournals)
        .fork(store.loadingError, store.ready);
      break;
    case 'loading-error':
      error('Error loading user journals endpoint:', JSON.stringify(state.error));
      break;
    case 'ready':
      break;
    default:
      assertNever(state);
  }
});

export default UserJournalsStoreReactions;
