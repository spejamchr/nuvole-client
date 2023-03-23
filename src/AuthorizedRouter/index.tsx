import { UserSessionResource } from '@/AuthenticationStore/Types';
import { CurrentUserResource } from '@/CurrentUserStore/Types';
import UnknownPath from '@/UnknownPath';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import * as React from 'react';

const Journals = React.lazy(() => import('@/Journals'));

interface Props {
  session: UserSessionResource;
  currentUser: CurrentUserResource;
}

const AuthorizedRouter: React.FC<Props> = ({ currentUser }) => {
  const { query } = useRouter();
  switch (query.a) {
    case undefined:
    case 'journals':
      return <Journals currentUser={currentUser} />;
    default:
      return <UnknownPath />;
  }
};

export default observer(AuthorizedRouter);
