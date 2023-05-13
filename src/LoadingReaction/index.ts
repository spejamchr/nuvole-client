import Reactor, { HasState } from '@/Reactor';
import { Link } from '@/Resource/Types';

interface Props {
  link: Link;
}

type LoadableStore = HasState<{ kind: string }> & { loading: (link: Link) => void };

export const LoadingReaction = Reactor<LoadableStore, Props>(({ store, link }) => (state) => {
  switch (state.kind) {
    case 'waiting':
      store.loading(link);
  }
});
