import { RootResource } from '@/RootStore/Types';
import WithRootStore from '@/WithRootStore';

const App: React.FC<{}> = () => (
  <div>
    <h1>Nuvole</h1>
    <WithRootStore
      children={(rootResource: RootResource) => <pre>{JSON.stringify(rootResource)}</pre>}
    />
  </div>
);

export default App;
