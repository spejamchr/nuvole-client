import ReadStore from '@/ReadStore';
import ReadStoreReactions from '@/ReadStore/Reactions';
import { findLink } from '@/Resource/Types';
import { CurrentUserResource } from '@/WithCurrentUser/Types';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ok } from 'resulty';
import { userJournalsDecoder } from './Decoder';

interface Props {
  currentUser: CurrentUserResource;
}

const Journals: React.FC<Props> = ({ currentUser }) => {
  const store = React.useRef(new ReadStore(userJournalsDecoder));

  React.useEffect(() => {
    ok(currentUser.links).andThen(findLink('journals')).do(store.current.loading);
  }, []);

  return (
    <>
      <ReadStoreReactions store={store.current} />
      <code>{JSON.stringify(store.current.state)}</code>
    </>
  );
};

export default observer(Journals);
