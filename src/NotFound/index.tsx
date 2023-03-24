import { observer } from 'mobx-react';
import * as React from 'react';

interface Props {}

const NotFound: React.FC<Props> = () => (
  <div className="px-16 py-12 text-gray-400">
    <span>404</span>
    <span className={`px-4`}>|</span>
    <span>Not Found</span>
  </div>
);

export default observer(NotFound);
