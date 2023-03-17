import { authenticationStore } from '@/AuthenticationStore';
import { Link } from '@/Resource/Types';
import { observer } from 'mobx-react';
import * as React from 'react';
import Inputs from './Inputs';

interface Props {
  authLink: Link;
}

const SubmitableForm: React.FC<Props> = ({ authLink }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        authenticationStore.authenticating(authLink);
      }}
    >
      <Inputs />
      <button>Submit</button>
    </form>
  );
};

export default observer(SubmitableForm);
