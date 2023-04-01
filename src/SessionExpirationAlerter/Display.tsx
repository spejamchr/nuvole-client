import { UserSession } from '@/SessionStore/Types';
import { observer } from 'mobx-react';
import * as React from 'react';
import AlertTimeoutManager from './AlertTimeoutManager';
import SessionAlert from './SessionAlert';

interface Props {
  session: UserSession;
}

const Display: React.FC<Props> = ({ session }) => {
  const [alerting, setAlerting] = React.useState(false);

  return (
    <>
      {alerting ? <SessionAlert session={session} /> : <></>}
      <AlertTimeoutManager session={session} onTimeout={() => setAlerting(true)} />
    </>
  );
};

export default observer(Display);
