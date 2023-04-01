import FormStore from '@/FormStore';
import FormStoreReactions from '@/FormStore/Reactions';
import { rootStore } from '@/RootStore';
import RootReactions from '@/RootStore/Reactions';
import { userSessionResourceDecoder } from '@/SessionStore/Decoders';
import { UserSessionResource } from '@/SessionStore/Types';
import { succeed } from 'jsonous';
import { observer } from 'mobx-react';
import * as React from 'react';
import Display from './Display';
import RootStoreAuthLinkReactions from './RootStoreAuthLinkReactions';
import { AuthFormStore } from './Types';
import WriteSessionOnAuthenticationReaction from './WriteSessionOnAuthenticationReaction';

interface Props {}

const Authentication: React.FC<Props> = () => {
  const storeRef = React.useRef<AuthFormStore>(new FormStore<{}, UserSessionResource>());

  return (
    <>
      <RootReactions store={rootStore} />
      <FormStoreReactions
        store={storeRef.current}
        fetchingDecoder={succeed({})}
        submittingDecoder={userSessionResourceDecoder}
      />
      <RootStoreAuthLinkReactions store={rootStore} authFormStore={storeRef.current} />
      <WriteSessionOnAuthenticationReaction store={storeRef.current} />
      <Display store={storeRef.current} />
    </>
  );
};

export default observer(Authentication);
