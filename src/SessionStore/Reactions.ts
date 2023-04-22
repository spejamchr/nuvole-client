import { callApi } from '@/Appy';
import { assertNever } from '@/AssertNever';
import { andTryR, fromJsonDecoderR } from '@/CooperExt';
import { error } from '@/Logging';
import Reactor from '@/Reactor';
import { findLinkT } from '@/Resource/Types';
import { getItem, removeItem, setItem } from '@/Storage';
import { ok } from 'resulty';
import Task from 'taskarian';
import { sessionStore } from '.';
import { cachedUserSessionResourceDecoder, userSessionResourceDecoder } from './Decoders';
import { ReadError, whenActiveSession } from './Types';

const sessionLocation = 'nuvSession';

const handleMissingSession = (err: ReadError): void => {
  switch (err.kind) {
    case 'raised':
    case 'failed-decoder':
      sessionStore.readingStorageError(err);
      break;
    case 'nullish':
    case 'expired-session':
      sessionStore.withoutSession();
      break;
    default:
      assertNever(err);
  }
};

const refreshSession = callApi(userSessionResourceDecoder, {});

const Reactions = Reactor<typeof sessionStore>(({ store }) => (state) => {
  switch (state.kind) {
    case 'waiting':
      break;
    case 'reading-storage':
      ok<ReadError, string>(sessionLocation)
        .andThen(getItem)
        .cata(andTryR(fromJsonDecoderR(cachedUserSessionResourceDecoder.decodeJson)))
        .cata(andTryR(whenActiveSession))
        .cata({
          Ok: store.withSession,
          Err: handleMissingSession,
        });
      break;
    case 'without-session':
      removeItem(sessionLocation);
      break;
    case 'reading-storage-error':
      error('Error reading session from storage:', JSON.stringify(state.error));
      break;
    case 'with-session':
      break;
    case 'writing-storage':
      setItem(sessionLocation, JSON.stringify(state.object)).cata({
        Ok: store.finishedWritingSession,
        Err: store.writingSessionError,
      });
      break;
    case 'writing-storage-error':
      error('Error writing session to storage:', JSON.stringify(state.error));
      break;
    case 'refreshing-session':
      Task.succeed(state.session.links)
        .andThen(findLinkT('update'))
        .andThen(refreshSession)
        .fork(store.refreshingSessionError, store.writingSession);
      break;
    case 'refreshing-session-error':
      error('Error refreshing session:', JSON.stringify(state.error));
      break;
    default:
      assertNever(state);
  }
});

export default Reactions;
