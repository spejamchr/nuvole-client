import { UserSession } from '@/SessionStore/Types';
import { observer } from 'mobx-react';
import * as React from 'react';
import Display from './Display';

interface Props {
  session: UserSession;
}

const SessionExpirationAlerter: React.FC<Props> = ({ session }) => (
  <Display key={session.expiresAt.valueOf()} session={session} />
);

export default observer(SessionExpirationAlerter);
