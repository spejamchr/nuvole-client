import FormStore from '@/FormStore';
import { State } from '@/FormStore/Types';
import { ClassReactor, EffectsProps } from '@/Reactor';
import { Link, Resource } from '@/Resource/Types';
import { assertNever } from '@kofno/piper';

interface Props {
  link: Link;
}

class LoadFormWithLink<F, S extends Resource<unknown>> extends ClassReactor<
  FormStore<F, S>,
  Props
> {
  effects =
    ({ store, link }: EffectsProps<FormStore<F, S>, Props>) =>
    (state: State<F, S>): void => {
      switch (state.kind) {
        case 'waiting':
          store.loading(link);
          break;
        case 'loading':
        case 'loading-error':
        case 'ready':
        case 'submitting':
        case 'submitting-error':
        case 'submitted':
          break;
        default:
          assertNever(state);
      }
    };
}

export default LoadFormWithLink;
