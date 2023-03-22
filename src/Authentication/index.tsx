import { authenticationStore } from '@/AuthenticationStore';
import Reactions from '@/AuthenticationStore/Reactions';
import { observer } from 'mobx-react';
import * as React from 'react';
import Form from './Form';

interface Props {}

const Authentication: React.FC<Props> = () => {
  React.useEffect(authenticationStore.formEntry);

  return (
    <>
      <Reactions store={authenticationStore} />
      <Form />
    </>
  );
};

export default observer(Authentication);
