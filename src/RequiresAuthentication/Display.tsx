import Authentication from '@/Authentication';
import { UserSessionResource, whenActiveSession } from '@/AuthenticationStore/Types';
import Loading from '@/Loading';
import SessionExpirationAlerter from '@/SessionExpirationAlerter';
import { sessionStore } from '@/SessionStore';
import { observer } from 'mobx-react';
import * as React from 'react';

interface Props {
  children: (session: UserSessionResource) => React.ReactNode;
}

const Display: React.FC<Props> = ({ children }) => {
  switch (sessionStore.state.kind) {
    case 'waiting':
    case 'reading-storage':
      return <Loading />;
    case 'reading-storage-error':
    case 'without-session':
      return <Authentication />;
    case 'with-session':
    case 'writing-session':
    case 'writing-session-error':
    case 'refreshing-session':
    case 'refreshing-session-error':
      return whenActiveSession(sessionStore.state.session)
        .map((session) => (
          <>
            {children(session)}
            <SessionExpirationAlerter session={session.payload} />
          </>
        ))
        .getOrElse(() => <Authentication />);
  }
};

export default observer(Display);
