import Loading from '@/Loading';
import LoadingError from '@/LoadingError';
import ReadStore from '@/ReadStore';
import { observer } from 'mobx-react';
import * as React from 'react';
import { CurrentUserPayload, CurrentUserResource } from './Types';

interface Props {
  store: ReadStore<CurrentUserPayload>;
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
      return <>{children(store.state.resource)}</>;
  }
};

export default observer(Display);
