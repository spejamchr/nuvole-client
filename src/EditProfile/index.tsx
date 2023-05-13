import FormStore from '@/FormStore';
import FormStoreReactions from '@/FormStore/Reactions';
import LoadFormWithLink from '@/LoadFormWithLink';
import { resourceFormDecoder } from '@/Resource/Decoders';
import { Link } from '@/Resource/Types';
import SubmittedToReadyReaction from '@/SubmittedToReadyReaction';
import { observer } from 'mobx-react';
import * as React from 'react';
import { editProfilePayloadDecoder } from './Decoders';
import Display from './Display';
import { EditProfilePayload } from './Types';

interface Props {
  link: Link;
}

const EditProfile: React.FC<Props> = ({ link }) => {
  const formStoreRef = React.useRef<FormStore<EditProfilePayload>>(new FormStore());

  return (
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
  );
};

export default observer(EditProfile);
