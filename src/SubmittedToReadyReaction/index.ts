import FormStore from '@/FormStore';
import { State } from '@/FormStore/Types';
import { ClassReactor, EffectsProps } from '@/Reactor';
import { ResourceForm } from '@/Resource/Types';
import { assertNever } from '@kofno/piper';

class SubmittedToReadyReaction<T> extends ClassReactor<FormStore<T, ResourceForm<T>>> {
  effects =
    ({ store }: EffectsProps<FormStore<T, ResourceForm<T>>>) =>
    (state: State<T, ResourceForm<T>>): void => {
      switch (state.kind) {
        case 'waiting':
        case 'loading':
        case 'loading-error':
        case 'ready':
        case 'submitting':
        case 'submitting-error':
          break;
        case 'submitted':
          store.ready(state.resource);
          break;
        default:
          assertNever(state);
      }
    };
}

export default SubmittedToReadyReaction;
