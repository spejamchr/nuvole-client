import FormStore from '@/FormStore';
import FormStoreReactions from '@/FormStore/Reactions';
import LoadFormWithLink from '@/LoadFormWithLink';
import Loading from '@/Loading';
import LoadingError from '@/LoadingError';
import { error } from '@/Logging';
import ReadStore from '@/ReadStore';
import { findLink } from '@/Resource/Types';
import { RootPayload } from '@/RootResource/Types';
import { userSessionResourceDecoder } from '@/SessionStore/Decoders';
import WhenResult from '@/WhenResult';
import { always } from '@kofno/piper';
import { observer } from 'mobx-react';
import * as React from 'react';
import { newProfilePayloadDecoder } from './Decoders';
import Display from './Display';
import { NewProfileStore } from './Types';

export interface Props {
  rootStore: ReadStore<RootPayload>;
}

const NewProfile: React.FC<Props> = ({ rootStore }) => {
  const formStoreRef = React.useRef<NewProfileStore>(new FormStore());

  switch (rootStore.state.kind) {
    case 'waiting':
    case 'loading':
      return <Loading />;
    case 'loading-error':
      return <LoadingError />;
    case 'ready':
      return (
        <WhenResult
          result={findLink('new_user')(rootStore.state.resource.links)}
          onError={(e) => error('Error rendering NewProfile:', JSON.stringify(e))}
          error={always(<LoadingError />)}
          children={(link) => (
            <>
              <LoadFormWithLink store={formStoreRef.current} link={link} />
              <FormStoreReactions
                store={formStoreRef.current}
                fetchingDecoder={newProfilePayloadDecoder}
                submittingDecoder={userSessionResourceDecoder}
              />
              <Display store={formStoreRef.current} />
            </>
          )}
        />
      );
  }
};

export default observer(NewProfile);
