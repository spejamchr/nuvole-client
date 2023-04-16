import ReadStore from '@/ReadStore';
import ReadStoreReactions from '@/ReadStore/Reactions';
import ReadStoreDisplay from '@/ReadStoreDisplay';
import { findLink } from '@/Resource/Types';
import { UserSessionResource } from '@/SessionStore/Types';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ok } from 'resulty';
import { currentUserDecoder } from './Decoder';
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
        <ReadStoreDisplay
          store={this.store}
          children={(state) => this.props.children(state.resource)}
        />
      </>
    );
  }
}

export default observer(WithCurrentUser);
