import { UserSession } from '@/AuthenticationStore/Types';
import { sessionStore } from '@/SessionStore';
import { observer } from 'mobx-react';
import * as React from 'react';

interface Props {
  session: UserSession;
}

const timeLeftMs = (session: UserSession): number =>
  session.expires.valueOf() - new Date().valueOf();

const SessionAlert: React.FC<Props> = ({ session }) => {
  const [timeLeft, setTimeLeft] = React.useState(timeLeftMs(session));

  React.useEffect(() => {
    const tag = window.setInterval(() => setTimeLeft(timeLeftMs(session)), 1000);
    return () => window.clearInterval(tag);
  }, []);

  return (
    <>
      <p>Logout in: {(timeLeft / 1000).toFixed(0)}s</p>
      <button onClick={() => sessionStore.refreshingSession()}>Stay logged in</button>
    </>
  );
};

export default observer(SessionAlert);
