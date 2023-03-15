import RootStore from '@/RootStore';
import { RootResource } from '@/RootStore/Types';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

interface Props {
  children: (rootResource: RootResource) => React.ReactElement;
  store: RootStore;
}

const Display: React.FC<Props> = ({ children, store }) => {
  switch (store.state.kind) {
    case 'waiting':
    case 'loading':
      return <p>Loading...</p>;
    case 'ready':
      return <>{children(store.state.resource)}</>;
    case 'error':
      return <p>Could not load root store...</p>;
  }
};

export default observer(Display);
