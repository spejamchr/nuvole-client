import { authenticationStore } from '@/AuthenticationStore';
import TextInput from '@/TextInput';
import { observer } from 'mobx-react';
import * as React from 'react';

interface Props {}

const Inputs: React.FC<Props> = ({}) => {
  return (
    <div className={`w-96`}>
      <div className={`w-full pb-4 text-lg text-gray-400`}>Login</div>
      <TextInput
        label="Email"
        value={authenticationStore.email}
        onChange={authenticationStore.setEmail}
      />
      <TextInput
        label="Password"
        value={authenticationStore.password}
        onChange={authenticationStore.setPassword}
        password
      />
    </div>
  );
};

export default observer(Inputs);
