import FormStore from '@/FormStore';
import FormStoreReactions from '@/FormStore/Reactions';
import ReadStore from '@/ReadStore';
import ReadStoreReactions from '@/ReadStore/Reactions';
import { rootPayloadDecoder } from '@/RootResource/Decoders';
import { RootPayload } from '@/RootResource/Types';
import { userSessionResourceDecoder } from '@/SessionStore/Decoders';
import { succeed } from 'jsonous';
import { observer } from 'mobx-react';
import * as React from 'react';
import RootStoreAuthLinkReactions from './RootStoreAuthLinkReactions';
import { AuthFormStore } from './Types';
import UnauthenticatedRouter from './UnauthenticatedRouter';
import WriteSessionOnAuthenticationReaction from './WriteSessionOnAuthenticationReaction';

interface Props {}

const rootHref = 'http://localhost:3000/root.json';

const Authentication: React.FC<Props> = () => {
  const rootStoreRef = React.useRef<ReadStore<RootPayload>>(new ReadStore());
  const storeRef = React.useRef<AuthFormStore>(new FormStore());

  React.useEffect(() => {
    rootStoreRef.current.loading({
      rel: 'self',
      href: rootHref,
      method: 'get',
      type: 'application/json',
    });
  });

  return (
    <>
      <ReadStoreReactions store={rootStoreRef.current} decoder={rootPayloadDecoder} />
      <FormStoreReactions
        store={storeRef.current}
        fetchingDecoder={succeed({})}
        submittingDecoder={userSessionResourceDecoder}
      />
      <RootStoreAuthLinkReactions store={rootStoreRef.current} authFormStore={storeRef.current} />
      <WriteSessionOnAuthenticationReaction store={storeRef.current} />
      <UnauthenticatedRouter store={storeRef.current} rootStore={rootStoreRef.current} />
    </>
  );
};

export default observer(Authentication);
