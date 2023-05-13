import ReadStore from '@/ReadStore';
import ReadStoreReactions from '@/ReadStore/Reactions';
import ReadStoreDisplay from '@/ReadStoreDisplay';
import { Link } from '@/Resource/Types';
import { observer } from 'mobx-react';
import * as React from 'react';
import { userJournalsDecoder } from './Decoder';
import { UserJournals } from './Types';
import { LoadingReaction } from '@/LoadingReaction';

interface Props {
  link: Link;
}

const Journals: React.FC<Props> = ({ link }) => {
  const store = React.useRef(new ReadStore<UserJournals>());

  return (
    <>
      <LoadingReaction store={store.current} link={link} />
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
