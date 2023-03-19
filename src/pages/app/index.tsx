import RequiresAuthentication from '@/RequiresAuthentication';
import { observer } from 'mobx-react';
import * as React from 'react';

const App: React.FC<{}> = () => {
  return (
    <div>
      <RequiresAuthentication>
        {(session) => (
          <>
            <h1>Nuvole</h1>
            <div>{JSON.stringify(session)}</div>
          </>
        )}
      </RequiresAuthentication>
    </div>
  );
};

export default observer(App);
