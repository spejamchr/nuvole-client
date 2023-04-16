import { andTryR } from '@/CooperExt';
import ReadStore from '@/ReadStore';
import ReadStoreReactions from '@/ReadStore/Reactions';
import ReadStoreDisplay from '@/ReadStoreDisplay';
import { findLink } from '@/Resource/Types';
import { sessionStore } from '@/SessionStore';
import { observer } from 'mobx-react';
import * as React from 'react';
import { userJournalsDecoder } from './Decoder';
import { UserJournals } from './Types';

interface Props {}

const Journals: React.FC<Props> = () => {
  const store = React.useRef(new ReadStore<UserJournals>());

  React.useEffect(() => {
    sessionStore.session
      .map((s) => s.links)
      .cata(andTryR(findLink('journals')))
      .do(store.current.loading);
  }, []);

  return (
    <>
      <ReadStoreReactions store={store.current} decoder={userJournalsDecoder} />
      <ReadStoreDisplay store={store.current}>
        {(state) => (
          <>
            Journals:
            <ul>
              {state.resource.payload.journals.map((journal) => (
                <li key={journal.payload.title}>{journal.payload.title}</li>
              ))}
            </ul>
          </>
        )}
      </ReadStoreDisplay>
    </>
  );
};

export default observer(Journals);
