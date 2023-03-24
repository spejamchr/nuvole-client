import { UserSessionResource } from '@/AuthenticationStore/Types';
import ReadStore from '@/ReadStore';
import ReadStoreReactions from '@/ReadStore/Reactions';
import { findLink } from '@/Resource/Types';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ok } from 'resulty';
import { currentUserPayloadDecoder } from './Decoder';
import Display from './Display';
import { CurrentUserResource } from './Types';

interface Props {
  session: UserSessionResource;
  children: (currentUser: CurrentUserResource) => React.ReactNode;
}

class WithCurrentUser extends React.Component<Props> {
  store = new ReadStore(currentUserPayloadDecoder);

  componentDidMount(): void {
    ok(this.props.session.links).andThen(findLink('user')).do(this.store.loading);
  }

  render() {
    return (
      <>
        <ReadStoreReactions store={this.store} />
        <Display store={this.store} children={this.props.children} />
      </>
    );
  }
}

export default observer(WithCurrentUser);
