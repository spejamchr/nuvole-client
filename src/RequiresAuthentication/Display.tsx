import Authentication from '@/Authentication';
import Loading from '@/Loading';
import SessionExpirationAlerter from '@/SessionExpirationAlerter';
import { sessionStore } from '@/SessionStore';
import { UserSessionResource, whenActiveSession } from '@/SessionStore/Types';
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
    case 'writing-storage':
    case 'writing-storage-error':
    case 'with-session':
    case 'refreshing-session':
    case 'refreshing-session-error':
      const session =
        'session' in sessionStore.state ? sessionStore.state.session : sessionStore.state.object;
      return whenActiveSession(session)
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
