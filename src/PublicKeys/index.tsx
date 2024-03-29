import ReadStore from '@/ReadStore';
import ReadStoreReactions from '@/ReadStore/Reactions';
import ReadStoreDisplay from '@/ReadStoreDisplay';
import { Link } from '@/Resource/Types';
import { observer } from 'mobx-react';
import * as React from 'react';
import { publicKeysPayloadDecoder } from './Decoders';
import { PublicKeysPayload } from './Types';
import { LoadingReaction } from '@/LoadingReaction';

interface Props {
  link: Link;
}

const Journals: React.FC<Props> = ({ link }) => {
  const store = React.useRef(new ReadStore<PublicKeysPayload>());

  return (
    <>
      <LoadingReaction store={store.current} link={link} />
      <ReadStoreReactions store={store.current} decoder={publicKeysPayloadDecoder} />
      <ReadStoreDisplay store={store.current}>
        {(state) => (
          <>
            Public Keys:
            <ul>
              {state.resource.payload.publicKeys.map((publicKey) => (
                <li key={publicKey.payload.label}>{publicKey.payload.label}</li>
              ))}
            </ul>
          </>
        )}
      </ReadStoreDisplay>
    </>
  );
};

export default observer(Journals);
