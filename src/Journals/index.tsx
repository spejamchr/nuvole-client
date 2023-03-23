import { CurrentUserResource } from '@/CurrentUserStore/Types';
import { findLink } from '@/Resource/Types';
import UserJournalsStore from '@/UserJournalsStore';
import UserJournalsStoreReactions from '@/UserJournalsStore/Reactions';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ok } from 'resulty';

interface Props {
  currentUser: CurrentUserResource;
}

const Journals: React.FC<Props> = ({ currentUser }) => {
  const journalsStore = React.useRef(new UserJournalsStore());

  React.useEffect(() => {
    ok(currentUser.links).andThen(findLink('journals')).do(journalsStore.current.loading);
  }, []);

  return (
    <>
      <UserJournalsStoreReactions store={journalsStore.current} />
      <code>{JSON.stringify(journalsStore.current.state)}</code>
    </>
  );
};

export default observer(Journals);
