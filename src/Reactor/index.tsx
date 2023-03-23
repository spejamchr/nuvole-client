import { IReactionDisposer, reaction } from 'mobx';
import * as React from 'react';
import { useEffect } from 'react';

interface HasState<State> {
  state: State;
}

interface Props<Store> {
  store: Store;
}

type Effects<Store extends HasState<unknown>> = (store: Store) => (state: Store['state']) => void;

const Reactor =
  <Store extends HasState<unknown>, SpecificProps = {}>(
    effects: Effects<Store>,
  ): React.FC<Props<Store> & SpecificProps> =>
  ({ store }) => {
    useEffect(() => reaction(() => store.state, effects(store), { fireImmediately: true }));
    return <></>;
  };

export default Reactor;

export abstract class ClassReactor<
  Store extends HasState<unknown>,
  SpecificProps = {},
> extends React.Component<Props<Store> & SpecificProps> {
  disposer: IReactionDisposer | undefined;

  componentDidMount(): void {
    this.disposer = reaction(() => this.props.store.state, this.effects(this.props.store));
  }

  abstract effects: Effects<Store>;

  componentWillUnmount(): void {
    if (this.disposer) {
      this.disposer();
    }
  }

  render() {
    return <></>;
  }
}
