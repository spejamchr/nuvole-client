import { reaction } from 'mobx';
import * as React from 'react';
import { useEffect } from 'react';

interface HasState<State> {
  state: State;
}

interface Props<Store> {
  store: Store;
}

export type EffectsProps<Store, SpecificProps = {}> = Props<Store> & SpecificProps;

type Effects<Store extends HasState<unknown>, SpecificProps> = (
  props: EffectsProps<Store, SpecificProps>,
) => (state: Store['state']) => void;

const Reactor =
  <Store extends HasState<unknown>, SpecificProps = {}>(
    effects: Effects<Store, SpecificProps>,
  ): React.FC<EffectsProps<Store, SpecificProps>> =>
  (props) => {
    useEffect(() => reaction(() => props.store.state, effects(props), { fireImmediately: true }));
    return <></>;
  };

export default Reactor;

export abstract class ClassReactor<
  Store extends HasState<unknown>,
  SpecificProps = {},
> extends React.Component<EffectsProps<Store, SpecificProps>> {
  abstract effects: Effects<Store, SpecificProps>;

  render() {
    const Reactions = Reactor<Store, SpecificProps>(
      (effects) => (props) => this.effects(effects)(props),
    );
    return <Reactions {...this.props} />;
  }
}
