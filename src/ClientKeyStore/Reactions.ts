import { assertNever } from '@/AssertNever';
import { andTryR, fromJsonDecoderR } from '@/CooperExt';
import { error } from '@/Logging';
import Reactor from '@/Reactor';
import { ReadError } from '@/SessionStore/Types';
import { getItem, removeItem, setItem } from '@/Storage';
import { ok } from 'resulty';
import { clientKeyStore } from '.';
import { clientKeyDecoder } from './Decoders';

const clientKeyLocation = 'nuvClientKey';

const handleMissingClientKey = (err: ReadError): void => {
  switch (err.kind) {
    case 'raised':
    case 'failed-decoder':
      clientKeyStore.readingStorageError(err);
      break;
    case 'nullish':
    case 'expired-session':
      clientKeyStore.withoutClientKey();
      break;
    default:
      assertNever(err);
  }
};

const Reactions = Reactor<typeof clientKeyStore>(({ store }) => (state) => {
  switch (state.kind) {
    case 'waiting':
      break;
    case 'reading-storage':
      ok<ReadError, string>(clientKeyLocation)
        .andThen(getItem)
        .cata(andTryR(fromJsonDecoderR(clientKeyDecoder.decodeJson)))
        .cata({
          Ok: store.withClientKey,
          Err: handleMissingClientKey,
        });
      break;
    case 'reading-storage-error':
      error('Error reading client-key from storage:', JSON.stringify(state.error));
      break;
    case 'without-client-key':
      removeItem(clientKeyLocation);
      break;
    case 'with-client-key':
      break;
    case 'creating-client-key':
      store.writingStorage(state.libsodium.sodium.crypto_box_keypair('base64'));
      break;
    case 'writing-storage':
      setItem(clientKeyLocation, JSON.stringify(state.object)).cata({
        Ok: store.finishedWritingClientKey,
        Err: store.writingStorageError,
      });
      break;
    case 'writing-storage-error':
      error('Error writing client-key to storage:', JSON.stringify(state.error));
      break;
    default:
      assertNever(state);
  }
});

export default Reactions;
