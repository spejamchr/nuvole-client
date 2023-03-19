import { authenticationStore } from '@/AuthenticationStore';
import { observer } from 'mobx-react';
import * as React from 'react';
import Form from './Form';

interface Props {}

const Display: React.FC<Props> = () => {
  switch (authenticationStore.state.kind) {
    case 'waiting':
    case 'form-entry':
    case 'form-ready':
    case 'authenticating':
    case 'authenticating-error':
      return <Form />;
    case 'authenticated':
      return <>Authenticated!</>;
  }
};

export default observer(Display);