import { callAuthenticatedApi } from '@/Appy';
import { assertNever } from '@/AssertNever';
import { authenticationStore } from '@/AuthenticationStore';
import { userSessionResourceDecoder } from '@/AuthenticationStore/Decoders';
import { whenActiveSession } from '@/AuthenticationStore/Types';
import { andTryR, fromJsonDecoderR } from '@/CooperExt';
import { error } from '@/Logging';
import Reactor from '@/Reactor';
import { findLinkT } from '@/Resource/Types';
import { getItem, removeItem, setItem } from '@/Storage';
import { ok } from 'resulty';
import Task from 'taskarian';
import { sessionStore } from '.';
import { ReadError } from './Types';

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
const refreshSession = callAuthenticatedApi(userSessionResourceDecoder, {});

const Reactions = Reactor<typeof sessionStore>((store) => (state) => {
  switch (state.kind) {
    case 'waiting':
      break;
    case 'reading-storage':
      ok<ReadError, string>(sessionLocation)
        .andThen(getItem)
        .cata(andTryR(fromJsonDecoderR(userSessionResourceDecoder.decodeJson)))
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
      authenticationStore.authenticated(state.session);
      break;
    case 'writing-session':
      setItem(sessionLocation, JSON.stringify(state.session)).cata({
        Ok: store.finishedWritingSession,
        Err: store.writingSessionError,
      });
      break;
    case 'writing-session-error':
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
