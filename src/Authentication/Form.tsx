import { authenticationStore } from '@/AuthenticationStore';
import { findLink } from '@/Resource/Types';
import WithRootStore from '@/WithRootStore';
import { observer } from 'mobx-react';
import * as React from 'react';

interface Props {}

const Form: React.FC<Props> = ({}) => {
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
      <WithRootStore
        ready={(root) =>
          findLink('authenticate')(root.links)
            .map((link) => (
              <button onClick={() => authenticationStore.authenticating(link)}>Submit</button>
            ))
            .getOrElse(() => <button>Submit</button>)
        }
        other={() => <button>Submit</button>}
      />
    </>
  );
};

export default observer(Form);
