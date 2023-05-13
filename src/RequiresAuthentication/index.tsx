import { sessionStore } from '@/SessionStore';
import SessionReactions from '@/SessionStore/Reactions';
import { UserSessionResource } from '@/SessionStore/Types';
import { observer } from 'mobx-react';
import * as React from 'react';
import Display from './Display';

interface Props {
  children: (session: UserSessionResource) => React.ReactNode;
}

const RequiresAuthentication: React.FC<Props> = ({ children }) => {
  return (
    <>
      <SessionReactions store={sessionStore} />
      <Display children={children} />
    </>
  );
};

export default observer(RequiresAuthentication);
