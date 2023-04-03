import FormStore from '@/FormStore';
import FormStoreReactions from '@/FormStore/Reactions';
import LoadFormWithLink from '@/LoadFormWithLink';
import LoadingError from '@/LoadingError';
import { error } from '@/Logging';
import { resourceFormDecoder } from '@/Resource/Decoders';
import { findLink } from '@/Resource/Types';
import SubmittedToReadyReaction from '@/SubmittedToReadyReaction';
import WhenResult from '@/WhenResult';
import { CurrentUserResource } from '@/WithCurrentUser/Types';
import { always } from '@kofno/piper';
import { observer } from 'mobx-react';
import * as React from 'react';
import { editProfilePayloadDecoder } from './Decoders';
import Display from './Display';
import { EditProfilePayload } from './Types';

interface Props {
  currentUser: CurrentUserResource;
}

const EditProfile: React.FC<Props> = ({ currentUser }) => {
  const formStoreRef = React.useRef<FormStore<EditProfilePayload>>(new FormStore());

  return (
    <WhenResult
      result={findLink('edit')(currentUser.links)}
      onError={(e) => error('Error rendering EditProfile:', JSON.stringify(e))}
      error={always(<LoadingError />)}
      children={(link) => (
        <>
          <LoadFormWithLink store={formStoreRef.current} link={link} />
          <FormStoreReactions
            store={formStoreRef.current}
            fetchingDecoder={editProfilePayloadDecoder}
            submittingDecoder={resourceFormDecoder(editProfilePayloadDecoder)}
          />
          <SubmittedToReadyReaction store={formStoreRef.current} />
          <Display store={formStoreRef.current} />
        </>
      )}
    />
  );
};

export default observer(EditProfile);
