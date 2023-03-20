import { UserSession } from '@/AuthenticationStore/Types';
import { observer } from 'mobx-react';
import * as React from 'react';
import AlertTimeoutManager from './AlertTimeoutManager';

interface Props {
  session: UserSession;
}

const SessionExpirationAlerter: React.FC<Props> = ({ session }) => {
  const [alerting, setAlerting] = React.useState(false);
  return (
    <>
      {alerting ? 'ALERT!' : 'not alerting yet...'}
      <AlertTimeoutManager
        key={session.expires.valueOf()}
        session={session}
        onTimeout={() => setAlerting(true)}
      />
    </>
  );
};

export default observer(SessionExpirationAlerter);
