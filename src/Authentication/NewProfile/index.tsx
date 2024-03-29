import { clientKeyStore } from '@/ClientKeyStore';
import FormStore from '@/FormStore';
import FormStoreReactions from '@/FormStore/Reactions';
import LoadingError from '@/LoadingError';
import { LoadingReaction } from '@/LoadingReaction';
import { error } from '@/Logging';
import ReadStore from '@/ReadStore';
import ReadStoreDisplay from '@/ReadStoreDisplay';
import { findLink } from '@/Resource/Types';
import { RootPayload } from '@/RootResource/Types';
import { userSessionResourceDecoder } from '@/SessionStore/Decoders';
import WhenUsableSodium from '@/SodiumStore/WhenUsableSodium';
import WhenResult from '@/WhenResult';
import { always } from '@kofno/piper';
import { observer } from 'mobx-react';
import * as React from 'react';
import { newProfilePayloadDecoder } from './Decoders';
import Display from './Display';
import ProfileCreatedReaction from './ProfileCreatedReaction';
import { NewProfileStore } from './Types';

export interface Props {
  rootStore: ReadStore<RootPayload>;
}

const NewProfile: React.FC<Props> = ({ rootStore }) => {
  const formStoreRef = React.useRef<NewProfileStore>(new FormStore());

  return (
    <>
      <WhenUsableSodium children={clientKeyStore.creatingClientKey} />
      <ReadStoreDisplay
        store={rootStore}
        children={(ready) => (
          <WhenResult
            result={findLink('new_user')(ready.resource.links)}
            onError={(e) => error('Error rendering NewProfile:', JSON.stringify(e))}
            error={always(<LoadingError />)}
            children={(link) => (
              <>
                <LoadingReaction store={formStoreRef.current} link={link} />
                <FormStoreReactions
                  store={formStoreRef.current}
                  fetchingDecoder={newProfilePayloadDecoder}
                  submittingDecoder={userSessionResourceDecoder}
                />
                <ProfileCreatedReaction store={formStoreRef.current} />
                <Display store={formStoreRef.current} />
              </>
            )}
          />
        )}
      />
    </>
  );
};

export default observer(NewProfile);
