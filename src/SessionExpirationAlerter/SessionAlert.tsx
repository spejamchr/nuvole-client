import Button from '@/Button';
import { sessionStore } from '@/SessionStore';
import { UserSession } from '@/SessionStore/Types';
import { observer } from 'mobx-react';
import * as React from 'react';

interface Props {
  session: UserSession;
}

const timeLeftMs = (session: UserSession): number =>
  session.expiresAt.valueOf() - new Date().valueOf();

const SessionAlert: React.FC<Props> = ({ session }) => {
  const [timeLeft, setTimeLeft] = React.useState(timeLeftMs(session));

  React.useEffect(() => {
    const tag = window.setInterval(() => setTimeLeft(timeLeftMs(session)), 1000);
    return () => window.clearInterval(tag);
  }, []);

  return (
    <div
      className={`absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center bg-black bg-opacity-40`}
    >
      <div className={`w-72 border border-gray-500 bg-gray-700 p-4`}>
        <p className={`mx-4 text-lg`}>
          Logout in: <code>{(timeLeft / 1000).toFixed(0)}</code>s
        </p>
        <div className={'mt-4 flex flex-col'}>
          <Button onClick={() => sessionStore.refreshingSession()}>Stay logged in</Button>
        </div>
      </div>
    </div>
  );
};

export default observer(SessionAlert);
