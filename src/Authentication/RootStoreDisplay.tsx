import Loading from '@/Loading';
import LoadingError from '@/LoadingError';
import ReadStore from '@/ReadStore';
import { RootPayload } from '@/RootResource/Types';
import { observer } from 'mobx-react';
import * as React from 'react';

interface Props {
  store: ReadStore<RootPayload>;
}

const RootStoreDisplay: React.FC<Props> = ({ store }) => {
  switch (store.state.kind) {
    case 'waiting':
    case 'loading':
      return <Loading />;
    case 'loading-error':
      return <LoadingError />;
    case 'ready':
      return <></>;
  }
};

export default observer(RootStoreDisplay);
