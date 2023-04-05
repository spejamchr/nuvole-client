import AuthenticatedRouter from '@/AuthenticatedRouter';
import RequiresAuthentication from '@/RequiresAuthentication';
import WithCurrentUser from '@/WithCurrentUser';
import { observer } from 'mobx-react';
import * as React from 'react';

const App: React.FC<{}> = () => {
  return (
    <RequiresAuthentication>
      {(session) => (
        <WithCurrentUser session={session}>
          {(currentUser) => <AuthenticatedRouter currentUser={currentUser} />}
        </WithCurrentUser>
      )}
    </RequiresAuthentication>
  );
};

export default observer(App);
