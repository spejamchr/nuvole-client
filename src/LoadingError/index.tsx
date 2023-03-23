import { observer } from 'mobx-react';
import * as React from 'react';

interface Props {}

const LoadingError: React.FC<Props> = () => (
  <div className="px-16 py-12 text-rose-200 text-opacity-80">
    <span>Error loading</span>
  </div>
);

export default observer(LoadingError);
