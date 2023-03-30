import Loading from '@/Loading';
import LoadingError from '@/LoadingError';
import ReadStore from '@/ReadStore';
import { observer } from 'mobx-react';
import * as React from 'react';
import { UserJournals } from './Types';

interface Props {
  store: ReadStore<UserJournals>;
}

const Display: React.FC<Props> = ({ store }) => {
  switch (store.state.kind) {
    case 'waiting':
    case 'loading':
      return <Loading />;
    case 'loading-error':
      return <LoadingError />;
    case 'ready':
      return (
        <ul>
          {store.state.resource.payload.journals.map((journal) => (
            <li key={journal.payload.title}>{journal.payload.title}</li>
          ))}
        </ul>
      );
  }
};

export default observer(Display);
