import { callAuthenticatedApi } from '@/Appy';
import { assertNever } from '@/AssertNever';
import { error } from '@/Logging';
import { ClassReactor } from '@/Reactor';
import { resourceDecoder } from '@/Resource/Decoders';
import { Link } from '@/Resource/Types';
import Decoder from 'jsonous';
import Task from 'taskarian';
import ReadStore from '.';
import { LoadError, State } from './Types';

const fetchResource = <T>(decoder: Decoder<T>) =>
  callAuthenticatedApi(resourceDecoder(decoder), {});

export class ReadStoreReactions<T> extends ClassReactor<ReadStore<T>> {
  effects =
    (store: ReadStore<T>) =>
    (state: State<T>): void => {
      switch (state.kind) {
        case 'waiting':
          break;
        case 'loading':
          Task.succeed<LoadError, Link>(state.link)
            .andThen(fetchResource(state.decoder))
            .fork(store.loadingError, store.ready);
          break;
        case 'loading-error':
          error('Error loading endpoint:', JSON.stringify(state.error));
          break;
        case 'ready':
          break;
        default:
          assertNever(state);
      }
    };
}

export default ReadStoreReactions;
