import { observer } from 'mobx-react';
import * as React from 'react';

interface Props {}

const UnknownPath: React.FC<Props> = () => (
  <div className="px-16 py-12 text-gray-200">
    <span>
      <span className={`px-6`}>Error</span>
      <span>|</span>
      <span className={`px-6`}>Unknown path</span>
    </span>
  </div>
);

export default observer(UnknownPath);
