import { authenticationStore } from '@/AuthenticationStore';
import Reactions from '@/AuthenticationStore/Reactions';
import { observer } from 'mobx-react';
import * as React from 'react';
import Display from './Display';

interface Props {}

const Authentication: React.FC<Props> = () => {
  React.useEffect(authenticationStore.formEntry);

  return (
    <>
      <Reactions store={authenticationStore} />
      <Display />
    </>
  );
};

export default observer(Authentication);
