import AuthorizedRouter from '@/AuthorizedRouter';
import RequiresAuthentication from '@/RequiresAuthentication';
import WithCurrentUser from '@/WithCurrentUser';
import { observer } from 'mobx-react';
import * as React from 'react';

const App: React.FC<{}> = () => {
  return (
    <RequiresAuthentication>
      {(session) => (
        <WithCurrentUser session={session}>
          {(currentUser) => <AuthorizedRouter session={session} currentUser={currentUser} />}
        </WithCurrentUser>
      )}
    </RequiresAuthentication>
  );
};

export default observer(App);
