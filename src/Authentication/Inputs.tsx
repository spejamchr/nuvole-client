import { authenticationStore } from '@/AuthenticationStore';
import { observer } from 'mobx-react';
import * as React from 'react';

interface Props {}

const Inputs: React.FC<Props> = ({}) => {
  return (
    <>
      <input
        value={authenticationStore.email}
        onChange={(e) => authenticationStore.setEmail(e.target.value)}
      />
      <input
        value={authenticationStore.password}
        onChange={(e) => authenticationStore.setPassword(e.target.value)}
      />
    </>
  );
};

export default observer(Inputs);
