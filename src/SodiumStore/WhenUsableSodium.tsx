import { observer } from 'mobx-react';
import * as React from 'react';
import { Usable } from './Types';
import sodiumStore from '.';

interface Props {
  children: (sodium: Usable) => React.ReactNode | void;
  loading?: () => React.ReactNode | void;
  error?: () => React.ReactNode | void;
}

const WhenUsableSodium: React.FC<Props> = ({ children, loading, error }) => {
  switch (sodiumStore.state.kind) {
    case 'waiting':
    case 'resolving-promise':
      return loading ? <>{loading()}</> : <></>;
    case 'resolving-error':
      return error ? <>{error()}</> : <></>;
    case 'usable':
      return <>{children(sodiumStore.state)}</>;
  }
};

export default observer(WhenUsableSodium);
