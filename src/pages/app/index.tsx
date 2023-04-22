import AuthenticatedRouter from '@/AuthenticatedRouter';
import { clientKeyStore } from '@/ClientKeyStore';
import Reactions from '@/ClientKeyStore/Reactions';
import RequiresAuthentication from '@/RequiresAuthentication';
import sodiumStore from '@/SodiumStore';
import SodiumStoreReactions from '@/SodiumStore/Reactions';
import WithCurrentUser from '@/WithCurrentUser';
import { observer } from 'mobx-react';
import * as React from 'react';

const App: React.FC<{}> = () => {
  React.useEffect(sodiumStore.resolvingPromise, []);
  React.useEffect(clientKeyStore.readingStorage, []);

  return (
    <>
      <SodiumStoreReactions store={sodiumStore} />
      <Reactions store={clientKeyStore} />
      <RequiresAuthentication>
        {(session) => (
          <WithCurrentUser session={session}>
            {(currentUser) => <AuthenticatedRouter currentUser={currentUser} />}
          </WithCurrentUser>
        )}
      </RequiresAuthentication>
    </>
  );
};

export default observer(App);
