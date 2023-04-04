import Loading from '@/Loading';
import LoadingError from '@/LoadingError';
import ReadStore from '@/ReadStore';
import { RootPayload } from '@/RootResource/Types';
import { observer } from 'mobx-react';
import * as React from 'react';
import Form from './Form';
import RootStoreDisplay from './RootStoreDisplay';
import { AuthFormStore } from './Types';

export interface Props {
  store: AuthFormStore;
  rootStore: ReadStore<RootPayload>;
}

const Display: React.FC<Props> = ({ store, rootStore }) => {
  switch (store.state.kind) {
    case 'waiting':
      return <RootStoreDisplay store={rootStore} />;
    case 'loading':
      return <Loading />;
    case 'loading-error':
      return <LoadingError />;
    case 'ready':
    case 'submitting':
    case 'submitting-error':
      return <Form store={store} resource={store.state.resource} rootStore={rootStore} />;
    case 'submitted':
      return <></>;
  }
};

export default observer(Display);
