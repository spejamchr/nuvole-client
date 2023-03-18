import { findLink } from '@/Resource/Types';
import { rootStore } from '@/RootStore';
import { observer } from 'mobx-react';
import * as React from 'react';
import { andTry } from '@/CooperExt';
import { authenticationStore } from '@/AuthenticationStore';
import Inputs from './Inputs';
import Button from '@/Button';

interface Props {}

const Form: React.FC<Props> = ({}) => (
  <form
    className={`m-8 w-fit bg-gray-800 p-8`}
    onSubmit={(e) => {
      e.preventDefault();
      rootStore.resource
        .map((r) => r.links)
        .cata(andTry(findLink('authenticate')))
        .do(authenticationStore.authenticating);
    }}
  >
    <Inputs />
    <div className={'mt-4 flex flex-col'}>
      <Button>Submit</Button>
    </div>
  </form>
);

export default observer(Form);
