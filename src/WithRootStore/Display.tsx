import RootStore from '@/RootStore';
import { Ready, RootResource, State } from '@/RootStore/Types';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

interface Props {
  ready: (rootResource: RootResource) => React.ReactElement;
  other: (state: Exclude<State, Ready>) => React.ReactElement;
  store: RootStore;
}

const Display: React.FC<Props> = ({ ready, other, store }) => {
  switch (store.state.kind) {
    case 'waiting':
    case 'loading':
    case 'error':
      return <>{other(store.state)}</>;
    case 'ready':
      return <>{ready(store.state.resource)}</>;
  }
};

export default observer(Display);
