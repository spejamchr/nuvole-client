import { andTryR } from '@/CooperExt';
import { findLink, Rel } from '@/Resource/Types';
import { sessionStore } from '@/SessionStore';
import WhenResult from '@/WhenResult';
import { CurrentUserResource } from '@/WithCurrentUser/Types';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  currentUser: CurrentUserResource;
}

const Home: React.FC<Props> = ({ currentUser }) => {
  const link = (rel: Rel) => sessionStore.session.map((s) => s.links).cata(andTryR(findLink(rel)));
  return (
    <div>
      <h1>Welcome</h1>
      <ul>
        <WhenResult result={findLink('edit')(currentUser.links)}>
          <li>
            <Link to="profile/edit">Edit Profile</Link>
          </li>
        </WhenResult>
        <WhenResult result={link('journals')}>
          <li>
            <Link to="journals">Journals</Link>
          </li>
        </WhenResult>
        <WhenResult result={link('user_subscriptions')}>
          <li>Subscriptions</li>
        </WhenResult>
        <WhenResult result={link('public_keys')}>
          <Link to="public-keys">Public Keys</Link>
        </WhenResult>
        <WhenResult result={link('template:user')}>
          <li>User Search</li>
        </WhenResult>
      </ul>
      <ul>
        <li>
          <details>
            <summary>
              <abbr title="Public Reference Token">PRT</abbr>
            </summary>
            {currentUser.payload.publicReferenceToken}
          </details>
        </li>
        <li>
          <details>
            <summary>Email address</summary>
            {currentUser.payload.email}
          </details>
        </li>
        <li>
          <details>
            <summary>Name</summary>
            {currentUser.payload.name.getOrElseValue('[None]')}
          </details>
        </li>
        <li>Joined at: {currentUser.payload.joinedAt.toLocaleString()}</li>
        <li>Journal count: {currentUser.payload.journalCount}</li>
        <li>Entry count: {currentUser.payload.entryCount}</li>
        <li>
          Findable by <abbr title="Public Reference Token">PRT</abbr>:{' '}
          {currentUser.payload.findableByPrt ? 'Yes' : 'No'}
        </li>
        <li>Findable by email address: {currentUser.payload.findableByEmail ? 'Yes' : 'No'}</li>
        <li>Findable by name: {currentUser.payload.findableByName ? 'Yes' : 'No'}</li>
      </ul>
    </div>
  );
};

export default observer(Home);
