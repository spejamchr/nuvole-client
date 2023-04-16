import { callApi } from '@/Appy';
import { assertNever } from '@/AssertNever';
import { LoadError } from '@/CommonStates/Types';
import { error } from '@/Logging';
import { ClassReactor, EffectsProps } from '@/Reactor';
import { resourceDecoder } from '@/Resource/Decoders';
import { Link } from '@/Resource/Types';
import Decoder from 'jsonous';
import Task from 'taskarian';
import ReadStore from '.';
import { State } from './Types';

const fetchResource = <T>(decoder: Decoder<T>) => callApi(resourceDecoder(decoder), {});

interface Props<T> {
  decoder: Decoder<T>;
}

export class ReadStoreReactions<T> extends ClassReactor<ReadStore<T>, Props<T>> {
  effects =
    ({ store, decoder }: EffectsProps<ReadStore<T>, Props<T>>) =>
    (state: State<T>): void => {
      switch (state.kind) {
        case 'waiting':
          break;
        case 'loading':
          Task.succeed<LoadError, Link>(state.link)
            .andThen(fetchResource(decoder))
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
