import FormStore from '@/FormStore';
import Loading from '@/Loading';
import LoadingError from '@/LoadingError';
import { observer } from 'mobx-react';
import * as React from 'react';
import Form from './Form';
import { EditProfilePayload } from './Types';

interface Props {
  store: FormStore<EditProfilePayload>;
}

const Display: React.FC<Props> = ({ store }) => {
  switch (store.state.kind) {
    case 'waiting':
    case 'loading':
      return <Loading />;
    case 'loading-error':
      return <LoadingError />;
    case 'ready':
    case 'submitting':
    case 'submitting-error':
    case 'submitted':
      return <Form store={store} resource={store.state.resource} />;
  }
};

export default observer(Display);
