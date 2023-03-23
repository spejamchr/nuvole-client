import { UserSessionResource } from '@/AuthenticationStore/Types';
import CurrentUserStore from '@/CurrentUserStore';
import CurrentUserStoreReactions from '@/CurrentUserStore/Reactions';
import { CurrentUserResource } from '@/CurrentUserStore/Types';
import { findLink } from '@/Resource/Types';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ok } from 'resulty';
import Display from './Display';

interface Props {
  session: UserSessionResource;
  children: (currentUser: CurrentUserResource) => React.ReactNode;
}

class WithCurrentUser extends React.Component<Props> {
  currentUserStore = new CurrentUserStore();

  componentDidMount(): void {
    ok(this.props.session.links).andThen(findLink('user')).do(this.currentUserStore.loading);
  }

  render() {
    return (
      <>
        <CurrentUserStoreReactions store={this.currentUserStore} />
        <Display store={this.currentUserStore} children={this.props.children} />
      </>
    );
  }
}

export default observer(WithCurrentUser);
