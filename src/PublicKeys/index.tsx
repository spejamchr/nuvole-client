import { andTryR } from '@/CooperExt';
import ReadStore from '@/ReadStore';
import ReadStoreReactions from '@/ReadStore/Reactions';
import ReadStoreDisplay from '@/ReadStoreDisplay';
import { findLink } from '@/Resource/Types';
import { sessionStore } from '@/SessionStore';
import { observer } from 'mobx-react';
import * as React from 'react';
import { publicKeysPayloadDecoder } from './Decoders';
import { PublicKeysPayload } from './Types';

interface Props {}

const Journals: React.FC<Props> = () => {
  const store = React.useRef(new ReadStore<PublicKeysPayload>());

  React.useEffect(() => {
    sessionStore.session
      .map((s) => s.links)
      .cata(andTryR(findLink('public_keys')))
      .do(store.current.loading);
  }, []);

  return (
    <>
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
