import { reaction } from 'mobx';
import * as React from 'react';

export interface HasState<State> {
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
    React.useEffect(() =>
      reaction(() => props.store.state, effects(props), { fireImmediately: true }),
    );
    return <></>;
  };

export default Reactor;

export abstract class ClassReactor<
  Store extends HasState<unknown>,
  SpecificProps = {},
> extends React.Component<EffectsProps<Store, SpecificProps>> {
  abstract effects: Effects<Store, SpecificProps>;

  render() {
    const Reactions = Reactor(this.effects);
    return <Reactions {...this.props} />;
  }
}
