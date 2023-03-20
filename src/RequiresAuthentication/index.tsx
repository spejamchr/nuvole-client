import Authentication from '@/Authentication';
import { UserSessionResource } from '@/AuthenticationStore/Types';
import { rootStore } from '@/RootStore';
import RootReactions from '@/RootStore/Reactions';
import SessionExpirationAlerter from '@/SessionExpirationAlerter';
import { sessionStore } from '@/SessionStore';
import SessionReactions from '@/SessionStore/Reactions';
import { observer } from 'mobx-react';
import * as React from 'react';

interface Props {
  children: (session: UserSessionResource) => React.ReactNode;
}

const RequiresAuthentication: React.FC<Props> = ({ children }) => {
  React.useEffect(() => {
    sessionStore.readingStorage();
    rootStore.loading();
  }, []);

  return (
    <>
      <RootReactions store={rootStore} />
      <SessionReactions store={sessionStore} />
      {sessionStore
        .session()
        .map((session) => (
          <>
            {children(session)}
            <SessionExpirationAlerter session={session.payload} />
          </>
        ))
        .getOrElse(() => (
          <Authentication />
        ))}
    </>
  );
};

export default observer(RequiresAuthentication);
