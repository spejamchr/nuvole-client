import { assertNever } from '@/AssertNever';
import { authenticationStore } from '@/AuthenticationStore';
import { userSessionResourceDecoder } from '@/AuthenticationStore/Decoders';
import { andTry, fromJsonDecoder } from '@/CooperExt';
import { error } from '@/Logging';
import Reactor from '@/Reactor';
import { getItem, setItem } from '@/Storage';
import { ok } from 'resulty';
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
      sessionStore.withoutSession();
      break;
    default:
      assertNever(err);
  }
};

const Reactions = Reactor<typeof sessionStore>((store) => (state) => {
  switch (state.kind) {
    case 'waiting':
      break;
    case 'reading-storage':
      ok<ReadError, string>(sessionLocation)
        .andThen(getItem)
        .cata(andTry(fromJsonDecoder(userSessionResourceDecoder.decodeJson)))
        .cata({
          Ok: store.withSession,
          Err: handleMissingSession,
        });
      break;
    case 'without-session':
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
      error('Error writing session to storage:', state.error);
      break;
    default:
      assertNever(state);
  }
});

export default Reactions;
