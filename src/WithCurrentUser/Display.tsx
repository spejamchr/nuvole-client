import CurrentUserStore from '@/CurrentUserStore';
import { CurrentUserResource } from '@/CurrentUserStore/Types';
import Loading from '@/Loading';
import LoadingError from '@/LoadingError';
import { observer } from 'mobx-react';
import * as React from 'react';

interface Props {
  store: CurrentUserStore;
  children: (session: CurrentUserResource) => React.ReactNode;
}

const Display: React.FC<Props> = ({ store, children }) => {
  switch (store.state.kind) {
    case 'waiting':
    case 'loading':
      return <Loading />;
    case 'loading-error':
      return <LoadingError />;
    case 'ready':
      return <>{children(store.state.currentUser)}</>;
  }
};

export default observer(Display);
