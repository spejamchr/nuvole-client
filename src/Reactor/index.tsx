import { IReactionDisposer, reaction } from 'mobx';
import * as React from 'react';
import { Store } from './Types';

interface Props<State, S extends Store<State>> {
  store: S;
}

abstract class Reactor<
  S extends Store<any>,
  State = S extends Store<infer T> ? T : never,
> extends React.Component<Props<State, S>> {
  public stop: IReactionDisposer | undefined;

  constructor(props: Props<State, S>) {
    super(props);
  }

  componentDidMount(): void {
    this.stop = reaction(() => this.props.store.state, this.effect(this.props.store));
  }

  abstract effect: (store: S) => (state: State) => void;

  componentWillUnmount(): void {
    this.stop && this.stop();
  }

  render() {
    return <></>;
  }
}

export default Reactor;
