import { findLink } from '@/Resource/Types';
import { rootStore } from '@/RootStore';
import { observer } from 'mobx-react';
import * as React from 'react';
import { andTryR } from '@/CooperExt';
import { authenticationStore } from '@/AuthenticationStore';
import Button from '@/Button';
import ErrorMsg from './ErrorMsg';
import TextInput from '@/TextInput';

interface Props {}

const Form: React.FC<Props> = ({}) => (
  <form
    className={`m-8 w-fit bg-gray-800 p-8`}
    onSubmit={(e) => {
      e.preventDefault();
      rootStore.resource
        .map((r) => r.links)
        .cata(andTryR(findLink('authenticate')))
        .do(authenticationStore.authenticating);
    }}
  >
    <div className={`flex place-items-end justify-between`}>
      <div className={`pb-4 pr-4 text-lg text-gray-200`}>Login</div>
      <ErrorMsg />
    </div>
    <div className={`w-96`}>
      <TextInput
        label="Email"
        value={authenticationStore.email}
        onChange={authenticationStore.setEmail}
        inputProps={{ disabled: !authenticationStore.editable }}
      />
      <TextInput
        label="Password"
        value={authenticationStore.password}
        onChange={authenticationStore.setPassword}
        inputProps={{ disabled: !authenticationStore.editable }}
        password
      />
      <div className={'mt-4 flex flex-col'}>
        <Button disabled={!authenticationStore.submittable}>Submit</Button>
      </div>
    </div>
  </form>
);

export default observer(Form);
