import { reaction } from 'mobx';
import * as React from 'react';
import { useEffect } from 'react';

interface HasState<State> {
  state: State;
}

interface Props<Store> {
  store: Store;
}

const Reactor =
  <Store extends HasState<unknown>>(
    effects: (store: Store) => (state: Store['state']) => void,
  ): React.FC<Props<Store>> =>
  ({ store }) => {
    useEffect(reaction(() => store.state, effects(store)));
    return <></>;
  };

export default Reactor;
