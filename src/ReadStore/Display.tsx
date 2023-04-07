import Loading from '@/Loading';
import LoadingError from '@/LoadingError';
import { observer } from 'mobx-react';
import * as React from 'react';
import ReadStore from '.';
import { Ready } from './Types';

interface Props<T> {
  store: ReadStore<T>;
  children: React.ReactNode | ((ready: Ready<T>) => React.ReactNode);
}

class ReadStoreDisplay<T> extends React.Component<Props<T>> {
  render() {
    const { store, children } = this.props;
    switch (store.state.kind) {
      case 'waiting':
      case 'loading':
        return <Loading />;
      case 'loading-error':
        return <LoadingError />;
      case 'ready':
        return typeof children === 'function' ? children(store.state) : children;
    }
  }
}

export default observer(ReadStoreDisplay);
