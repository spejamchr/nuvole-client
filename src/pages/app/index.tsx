import AuthenticatedRouter from '@/AuthenticatedRouter';
import { clientKeyStore } from '@/ClientKeyStore';
import Reactions from '@/ClientKeyStore/Reactions';
import LoadingError from '@/LoadingError';
import { error } from '@/Logging';
import RequiresAuthentication from '@/RequiresAuthentication';
import { findLink } from '@/Resource/Types';
import sodiumStore from '@/SodiumStore';
import SodiumStoreReactions from '@/SodiumStore/Reactions';
import WithCurrentUser from '@/WithCurrentUser';
import { observer } from 'mobx-react';
import * as React from 'react';

const App: React.FC<{}> = () => {
  return (
    <>
      <SodiumStoreReactions store={sodiumStore} />
      <Reactions store={clientKeyStore} />
      <RequiresAuthentication>
        {(session) =>
          findLink('profile', session.links)
            .elseDo(error)
            .cata({
              Ok: (profileLink) => (
                <WithCurrentUser link={profileLink}>
                  {(currentUser) => (
                    <AuthenticatedRouter session={session} currentUser={currentUser} />
                  )}
                </WithCurrentUser>
              ),
              Err: () => <LoadingError />,
            })
        }
      </RequiresAuthentication>
    </>
  );
};

export default observer(App);
