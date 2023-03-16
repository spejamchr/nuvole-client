import Authentication from '@/Authentication';
import { authenticationStore } from '@/AuthenticationStore';
import Reactions from '@/AuthenticationStore/Reactions';
import { RootResource } from '@/RootStore/Types';
import WithRootStore from '@/WithRootStore';

const App: React.FC<{}> = () => (
  <div>
    <h1>Nuvole</h1>
    <Reactions store={authenticationStore} />
    <Authentication children={(session) => <pre>{JSON.stringify(session)}</pre>} />
    <WithRootStore
      ready={(rootResource: RootResource) => <pre>{JSON.stringify(rootResource)}</pre>}
    />
  </div>
);

export default App;
