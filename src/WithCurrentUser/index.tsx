import ReadStore from '@/ReadStore';
import ReadStoreReactions from '@/ReadStore/Reactions';
import { findLink } from '@/Resource/Types';
import { UserSessionResource } from '@/SessionStore/Types';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ok } from 'resulty';
import { currentUserDecoder } from './Decoder';
import Display from './Display';
import { CurrentUser, CurrentUserResource } from './Types';

interface Props {
  session: UserSessionResource;
  children: (currentUser: CurrentUserResource) => React.ReactNode;
}

class WithCurrentUser extends React.Component<Props> {
  store = new ReadStore<CurrentUser>();

  componentDidMount(): void {
    ok(this.props.session.links).andThen(findLink('profile')).do(this.store.loading);
  }

  render() {
    return (
      <>
        <ReadStoreReactions store={this.store} decoder={currentUserDecoder} />
        <Display store={this.store} children={this.props.children} />
      </>
    );
  }
}

export default observer(WithCurrentUser);
