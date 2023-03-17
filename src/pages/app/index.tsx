import Authentication from '@/Authentication';
import { authenticationStore } from '@/AuthenticationStore';
import AuthReactions from '@/AuthenticationStore/Reactions';
import { RootResource } from '@/RootStore/Types';
import WithRootStore from '@/WithRootStore';
import RootReactions from '@/RootStore/Reactions';
import { rootStore } from '@/RootStore';
import { useEffect } from 'react';

const rootHref = 'http://localhost:3000/root.json';

const App: React.FC<{}> = () => {
  useEffect(() =>
    rootStore.loading({
      rel: 'self',
      href: rootHref,
      method: 'get',
      type: 'application/json',
    }),
  );

  return (
    <div>
      <h1>Nuvole</h1>
      <RootReactions store={rootStore} />
      <AuthReactions store={authenticationStore} />
      <Authentication children={(session) => <pre>{JSON.stringify(session)}</pre>} />
    </div>
  );
};

export default App;
