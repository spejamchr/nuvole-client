import { authenticationStore } from '@/AuthenticationStore';
import { UserSessionResource } from '@/AuthenticationStore/Types';
import { observer } from 'mobx-react';
import * as React from 'react';
import Form from './Form';

interface Props {
  children: (session: UserSessionResource) => React.ReactElement;
}

const Authentication: React.FC<Props> = ({}) => {
  React.useEffect(authenticationStore.formEntry);

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

export default observer(Authentication);
