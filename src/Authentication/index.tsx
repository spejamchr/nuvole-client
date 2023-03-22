import { authenticationStore } from '@/AuthenticationStore';
import Reactions from '@/AuthenticationStore/Reactions';
import { rootStore } from '@/RootStore';
import RootReactions from '@/RootStore/Reactions';
import { observer } from 'mobx-react';
import * as React from 'react';
import Form from './Form';

interface Props {}

const Authentication: React.FC<Props> = () => {
  React.useEffect(rootStore.loading);
  React.useEffect(authenticationStore.formEntry);

  return (
    <>
      <RootReactions store={rootStore} />
      <Reactions store={authenticationStore} />
      <Form />
    </>
  );
};

export default observer(Authentication);
