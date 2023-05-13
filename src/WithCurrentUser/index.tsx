import { LoadingReaction } from '@/LoadingReaction';
import ReadStore from '@/ReadStore';
import ReadStoreReactions from '@/ReadStore/Reactions';
import ReadStoreDisplay from '@/ReadStoreDisplay';
import { Link } from '@/Resource/Types';
import { observer } from 'mobx-react';
import * as React from 'react';
import { currentUserDecoder } from './Decoder';
import { CurrentUser, CurrentUserResource } from './Types';

interface Props {
  link: Link;
  children: (currentUser: CurrentUserResource) => React.ReactNode;
}

class WithCurrentUser extends React.Component<Props> {
  store = new ReadStore<CurrentUser>();

  render() {
    return (
      <>
        <LoadingReaction store={this.store} link={this.props.link} />
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
