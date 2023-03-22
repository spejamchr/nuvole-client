import { observer } from 'mobx-react';
import * as React from 'react';

interface Props {}

const Loading: React.FC<Props> = () => (
  <div className="px-16 py-12 text-gray-400">
    <span>Loading...</span>
  </div>
);

export default observer(Loading);
