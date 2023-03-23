import { UserSessionResource } from '@/AuthenticationStore/Types';
import { CurrentUserResource } from '@/CurrentUserStore/Types';
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
      return (
        <div className="px-16 py-12 text-gray-200">
          <span>
            <span className={`px-6`}>Error</span>
            <span>|</span>
            <span className={`px-6`}>Unknown path</span>
          </span>
        </div>
      );
  }
};

export default observer(AuthorizedRouter);
